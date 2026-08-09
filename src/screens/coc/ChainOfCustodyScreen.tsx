import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import SignatureCanvas from 'react-native-signature-canvas';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import FormInput from '../../components/FormInput';
import GradientButton from '../../components/GradientButton';
import Header from '../../components/Header';
import { useAppStore, SampleItem, SAMPLE_MEDIA_TYPES } from '../../store/useAppStore';
import { generatePDFReport, sharePDFReport } from '../../utils/pdfGenerator';
import { sendReportToLab } from '../../utils/emailDispatcher';

const sigCanvasStyle = `.m-signature-pad--footer { display: flex; justify-content: space-between; margin-top: 10px; } .m-signature-pad { box-shadow: none; border: 1px solid #E2E8F0; border-radius: 12px; }`;

export default function ChainOfCustodyScreen({ navigation }: any) {
  const currentReport = useAppStore((state) => state.currentReport);
  const updateCurrentReport = useAppStore((state) => state.updateCurrentReport);
  const addSample = useAppStore((state) => state.addSample);
  const updateSample = useAppStore((state) => state.updateSample);
  const removeSample = useAppStore((state) => state.removeSample);
  const submitCurrentReport = useAppStore((state) => state.submitCurrentReport);

  // Modals state
  const [editContactsVisible, setEditContactsVisible] = useState(false);
  const [courierSigVisible, setCourierSigVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [notesModalSampleId, setNotesModalSampleId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Sample Cassette Picker Modal State
  const [mediaPickerSampleId, setMediaPickerSampleId] = useState<string | null>(null);

  const sigRef = useRef<any>(null);

  const handleUpdate = (field: string, value: any) => {
    updateCurrentReport({ [field]: value });
  };

  // Add new sample row
  const handleAddSampleRow = () => {
    const nextNum = (currentReport.samples.length + 13).toString();
    const newSample: SampleItem = {
      id: Math.random().toString(),
      sampleId: nextNum,
      sampleType: 'Asbestos PCM Cassette',
      analysis1: true,
      analysis2: false,
      description: '',
      property: 'None',
      measurement: '0',
      measurementUnit: 'N/A',
      notes: '',
    };
    addSample(newSample);
  };

  // Photo Attachments (Camera / Gallery chooser)
  const handlePickPhoto = async (sampleId: string) => {
    Alert.alert(
      'Attach Sample Photo',
      'Choose image source:',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const perm = await ImagePicker.requestCameraPermissionsAsync();
            if (perm.granted) {
              const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
              if (!res.canceled && res.assets.length > 0) {
                updateSample(sampleId, { photoUri: res.assets[0].uri });
              }
            }
          },
        },
        {
          text: 'Photo Gallery',
          onPress: async () => {
            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (perm.granted) {
              const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });
              if (!res.canceled && res.assets.length > 0) {
                updateSample(sampleId, { photoUri: res.assets[0].uri });
              }
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Save Courier Signature
  const handleSaveSignature = (signatureBase64: string) => {
    handleUpdate('courierSignature', signatureBase64);
    setCourierSigVisible(false);
    Alert.alert('Signature Saved', 'Courier signature attached successfully.');
  };

  // Preview CoC PDF
  const handlePreviewCoC = async () => {
    try {
      setPdfLoading(true);
      const pdfUri = await generatePDFReport(currentReport);
      await sharePDFReport(pdfUri);
    } catch (err) {
      Alert.alert('Error', 'Failed to generate CoC PDF preview.');
    } finally {
      setPdfLoading(false);
    }
  };

  // Submit CoC
  const handleSubmitCoC = async () => {
    if (!currentReport.agreedToTerms) {
      Alert.alert('Terms of Service', 'Please toggle to agree to the Terms of Service before submitting.');
      return;
    }
    submitCurrentReport();
    Alert.alert('CoC Submitted', 'Chain of Custody submitted to laboratory!');
    try {
      const pdfUri = await generatePDFReport(currentReport);
      await sendReportToLab(
        'labserve@eurofins-env.com',
        currentReport.poNumber || currentReport.id,
        pdfUri
      );
    } catch (e) {
      console.log('Lab dispatch notice:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Chain of Custody"
        subtitle={`PO #: ${currentReport.poNumber || 'PO-99482'} • ${currentReport.accountName}`}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* SECTION 1: PROJECT INFO (Screenshot 3) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Project Info</Text>

          <FormInput
            label="Description"
            placeholder="e.g. Mold & Asbestos Inspection"
            value={currentReport.description}
            onChangeText={(v) => handleUpdate('description', v)}
          />

          <View style={styles.rowTwoCols}>
            <View style={{ flex: 0.48 }}>
              <FormInput
                label="PO #"
                placeholder="PO-99482"
                value={currentReport.poNumber}
                onChangeText={(v) => handleUpdate('poNumber', v)}
              />
            </View>
            <View style={{ flex: 0.48 }}>
              <FormInput
                label="Zipcode"
                placeholder="75208"
                value={currentReport.zipcode}
                onChangeText={(v) => handleUpdate('zipcode', v)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.rowTwoCols}>
            <View style={{ flex: 0.48 }}>
              <FormInput
                label="Sampling date"
                placeholder="01/27/2026"
                value={currentReport.samplingDate}
                onChangeText={(v) => handleUpdate('samplingDate', v)}
              />
            </View>
            <View style={{ flex: 0.48 }}>
              <FormInput
                label="Sampling time"
                placeholder="09:49 AM"
                value={currentReport.samplingTime}
                onChangeText={(v) => handleUpdate('samplingTime', v)}
              />
            </View>
          </View>
        </View>

        {/* SECTION 2: CONTACT INFO (Screenshot 3) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Contact Info</Text>
            <TouchableOpacity onPress={() => setEditContactsVisible(true)}>
              <Text style={styles.linkText}>Edit Contacts</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Account:</Text>
            <Text style={styles.infoValue}>{currentReport.accountName}</Text>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Contacts:</Text>
            <Text style={styles.infoValue}>{currentReport.contactName}</Text>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{currentReport.address}</Text>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{currentReport.phone}</Text>
          </View>

          <FormInput
            label="Sampled by"
            placeholder="Ali Saleh"
            value={currentReport.sampledBy}
            onChangeText={(v) => handleUpdate('sampledBy', v)}
            style={{ marginTop: 6 }}
          />
        </View>

        {/* SECTION 3: WEATHER INFO (Screenshot 4) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Weather Info</Text>

          <View style={styles.switchRow}>
            <Text style={typography.bodyBold}>Clear Weather</Text>
            <Switch
              value={currentReport.weatherClear}
              onValueChange={(v) => handleUpdate('weatherClear', v)}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={styles.rowTwoCols}>
            <View style={{ flex: 0.48 }}>
              <FormInput
                label="Fog"
                placeholder="None"
                value={currentReport.weatherFog}
                onChangeText={(v) => handleUpdate('weatherFog', v)}
              />
            </View>
            <View style={{ flex: 0.48 }}>
              <FormInput
                label="Rain"
                placeholder="None"
                value={currentReport.weatherRain}
                onChangeText={(v) => handleUpdate('weatherRain', v)}
              />
            </View>
          </View>

          <View style={styles.rowTwoCols}>
            <View style={{ flex: 0.48 }}>
              <FormInput
                label="Snow"
                placeholder="None"
                value={currentReport.weatherSnow}
                onChangeText={(v) => handleUpdate('weatherSnow', v)}
              />
            </View>
            <View style={{ flex: 0.48 }}>
              <FormInput
                label="Wind"
                placeholder="None"
                value={currentReport.weatherWind}
                onChangeText={(v) => handleUpdate('weatherWind', v)}
              />
            </View>
          </View>
        </View>

        {/* SECTION 4: SAMPLES MANIFEST EDITOR (Screenshot 2 & Screenshot 5) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Samples ({currentReport.samples.length})</Text>
            <Text style={styles.summaryBadge}>Asbestos PLM • Next-day rush</Text>
          </View>

          {currentReport.samples.map((item) => (
            <View key={item.id} style={styles.sampleBox}>
              <View style={styles.sampleTopRow}>
                <Text style={styles.sampleIdTitle}>Sample ID  {item.sampleId}</Text>
                <TouchableOpacity onPress={() => removeSample(item.id)}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>

              {/* Sample Media / Cassette Selector (Screenshot 5 integration) */}
              <TouchableOpacity
                style={styles.cassetteSelectorBtn}
                onPress={() => setMediaPickerSampleId(item.id)}
              >
                <Ionicons name="beaker-outline" size={18} color={colors.primary} />
                <Text style={styles.cassetteSelectorText}>
                  Media: <Text style={{ fontWeight: '700' }}>{item.sampleType || 'Select Cassette Type'}</Text>
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
              </TouchableOpacity>

              {/* Analysis 1 & 2 Toggles (Screenshot 2) */}
              <View style={styles.togglesRow}>
                <View style={styles.toggleGroup}>
                  <Text style={styles.toggleLabel}>Analysis 1:</Text>
                  <Switch
                    value={item.analysis1}
                    onValueChange={(val) => updateSample(item.id, { analysis1: val })}
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>

                <View style={styles.toggleGroup}>
                  <Text style={styles.toggleLabel}>Analysis 2:</Text>
                  <Switch
                    value={item.analysis2}
                    onValueChange={(val) => updateSample(item.id, { analysis2: val })}
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>
              </View>

              <FormInput
                label="Description"
                placeholder="e.g. Bedroom Drywall"
                value={item.description}
                onChangeText={(v) => updateSample(item.id, { description: v })}
              />

              <View style={styles.rowTwoCols}>
                <View style={{ flex: 0.48 }}>
                  <FormInput
                    label="Property"
                    placeholder="None"
                    value={item.property}
                    onChangeText={(v) => updateSample(item.id, { property: v })}
                  />
                </View>

                <View style={{ flex: 0.48 }}>
                  <FormInput
                    label="Measurement"
                    placeholder="0 N/A"
                    value={`${item.measurement} ${item.measurementUnit}`}
                    onChangeText={(v) => updateSample(item.id, { measurement: v })}
                  />
                </View>
              </View>

              {/* Notes & Photo Attachments */}
              <View style={styles.notesRow}>
                {item.notes ? (
                  <Text style={styles.sampleNotesText}>Notes: {item.notes}</Text>
                ) : (
                  <TouchableOpacity onPress={() => {
                    setNotesModalSampleId(item.id);
                    setTempNotes('');
                  }}>
                    <Text style={styles.linkText}>+ Add notes</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.photoAttachBtn} onPress={() => handlePickPhoto(item.id)}>
                  <Ionicons name="camera-outline" size={16} color={colors.primary} />
                  <Text style={styles.photoAttachText}>
                    {item.photoUri ? 'Change Photo' : 'Attach Photo'}
                  </Text>
                </TouchableOpacity>
              </View>

              {item.photoUri && (
                <Image source={{ uri: item.photoUri }} style={styles.sampleThumb} />
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addSamplesBtn} onPress={handleAddSampleRow}>
            <Text style={styles.addSamplesBtnText}>+ Add Samples</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 5: SPECIAL INSTRUCTIONS (Screenshot 4) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <FormInput
            placeholder="Enter lab analyst instructions..."
            value={currentReport.specialInstructions}
            onChangeText={(v) => handleUpdate('specialInstructions', v)}
            multiline
            numberOfLines={4}
            style={{ height: 90 }}
          />
        </View>

        {/* SECTION 6: REVIEW AND SUBMIT (Screenshot 1) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Review and Submit</Text>

          <TouchableOpacity
            style={styles.courierBtn}
            onPress={() => setCourierSigVisible(true)}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} />
            <Text style={styles.courierBtnText}>
              {currentReport.courierSignature ? '✓ Courier Signature Added' : 'Add Courier Signature'}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>Resampling notification:</Text>
            <Text style={styles.infoValue}>{currentReport.resamplingNotification || 'None'}</Text>
          </View>

          {/* Terms of Service Toggle */}
          <View style={styles.switchRow}>
            <TouchableOpacity onPress={() => setTermsVisible(true)} style={{ flex: 1 }}>
              <Text style={styles.termsText}>
                I have read and agree to the <Text style={styles.linkTextInline}>Terms of Service</Text>
              </Text>
            </TouchableOpacity>
            <Switch
              value={currentReport.agreedToTerms}
              onValueChange={(v) => handleUpdate('agreedToTerms', v)}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          {/* Save as Template Toggle */}
          <View style={styles.switchRow}>
            <Text style={typography.bodyBold}>Save as template for future projects</Text>
            <Switch
              value={currentReport.isTemplate}
              onValueChange={(v) => handleUpdate('isTemplate', v)}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          {/* PREVIEW CoC & SUBMIT CoC BUTTONS */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.previewBtn}
              onPress={handlePreviewCoC}
              disabled={pdfLoading}
            >
              <Text style={styles.previewBtnText}>Preview CoC</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmitCoC}
            >
              <Text style={styles.submitBtnText}>Submit CoC</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* MODAL 1: CASSETTE / SAMPLE MEDIA PICKER (Screenshot 5 Integration) */}
      <Modal visible={mediaPickerSampleId !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={typography.h2}>Select Sampling Media / Cassette</Text>
              <TouchableOpacity onPress={() => setMediaPickerSampleId(null)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }}>
              {SAMPLE_MEDIA_TYPES.map((media) => (
                <TouchableOpacity
                  key={media.id}
                  style={styles.mediaOptionRow}
                  onPress={() => {
                    if (mediaPickerSampleId) {
                      updateSample(mediaPickerSampleId, { sampleType: media.name });
                    }
                    setMediaPickerSampleId(null);
                  }}
                >
                  <View style={styles.mediaIconCircle}>
                    <Ionicons name={media.icon as any} size={22} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.bodyBold}>{media.name}</Text>
                    <Text style={typography.caption}>{media.category}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: EDIT CONTACTS MODAL */}
      <Modal visible={editContactsVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={typography.h2}>Edit Contact Info</Text>
              <TouchableOpacity onPress={() => setEditContactsVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <FormInput
                label="Account Name"
                value={currentReport.accountName}
                onChangeText={(v) => handleUpdate('accountName', v)}
              />
              <FormInput
                label="Contact Name"
                value={currentReport.contactName}
                onChangeText={(v) => handleUpdate('contactName', v)}
              />
              <FormInput
                label="Address"
                value={currentReport.address}
                onChangeText={(v) => handleUpdate('address', v)}
              />
              <FormInput
                label="Phone Number"
                value={currentReport.phone}
                onChangeText={(v) => handleUpdate('phone', v)}
              />

              <GradientButton title="Save Contacts" onPress={() => setEditContactsVisible(false)} style={{ marginTop: 10 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: COURIER SIGNATURE MODAL */}
      <Modal visible={courierSigVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: 420 }]}>
            <View style={styles.modalHeader}>
              <Text style={typography.h2}>Courier Signature</Text>
              <TouchableOpacity onPress={() => setCourierSigVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <SignatureCanvas
                ref={sigRef}
                onOK={handleSaveSignature}
                webStyle={sigCanvasStyle}
                descriptionText="Sign Above for Courier Sign-Off"
                clearText="Clear Signature"
                confirmText="Save Signature"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: TERMS OF SERVICE MODAL */}
      <Modal visible={termsVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={typography.h2}>Terms of Service</Text>
              <TouchableOpacity onPress={() => setTermsVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.termsBodyText}>
                By submitting this Chain of Custody (CoC) document, you certify that all sample metadata, field notes, location descriptions, and sampling dates are true and accurate. Samples submitted to the receiving laboratory are subject to standard lab processing fees and agreed turnaround times. The customer agrees to indemnify and hold harmless the testing laboratory against field sampling errors.
              </Text>
            </ScrollView>

            <GradientButton
              title="I Agree to Terms"
              onPress={() => {
                handleUpdate('agreedToTerms', true);
                setTermsVisible(false);
              }}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>

      {/* MODAL 5: ADD NOTES MODAL */}
      <Modal visible={notesModalSampleId !== null} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={typography.h2}>Add Sample Notes</Text>
              <TouchableOpacity onPress={() => setNotesModalSampleId(null)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <FormInput
              placeholder="e.g. Near window frame, wet drywall"
              value={tempNotes}
              onChangeText={setTempNotes}
              multiline
              numberOfLines={3}
            />

            <GradientButton
              title="Save Notes"
              onPress={() => {
                if (notesModalSampleId) {
                  updateSample(notesModalSampleId, { notes: tempNotes });
                }
                setNotesModalSampleId(null);
              }}
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  linkText: {
    ...typography.subhead,
    color: colors.primary,
    fontWeight: '600',
  },
  linkTextInline: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  rowTwoCols: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    width: 100,
  },
  infoValue: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 10,
  },
  termsText: {
    ...typography.body,
    flex: 1,
    marginRight: 10,
  },
  summaryBadge: {
    ...typography.caption,
    color: colors.primaryDark,
    backgroundColor: 'rgba(3, 193, 182, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
  sampleBox: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sampleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sampleIdTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
  },
  cassetteSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  cassetteSelectorText: {
    ...typography.subhead,
    flex: 1,
    marginLeft: 8,
  },
  togglesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    ...typography.subhead,
    fontWeight: '600',
    marginRight: 8,
  },
  notesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sampleNotesText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 0.6,
  },
  photoAttachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoAttachText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  sampleThumb: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginTop: 8,
  },
  addSamplesBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addSamplesBtnText: {
    ...typography.button,
    color: colors.primary,
  },
  courierBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(3, 193, 182, 0.1)',
    marginBottom: 12,
  },
  courierBtnText: {
    ...typography.bodyBold,
    color: colors.primary,
    marginLeft: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  previewBtn: {
    flex: 0.48,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  previewBtnText: {
    ...typography.button,
    color: colors.primary,
  },
  submitBtn: {
    flex: 0.48,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    ...typography.button,
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mediaOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mediaIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(3, 193, 182, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  termsBodyText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
