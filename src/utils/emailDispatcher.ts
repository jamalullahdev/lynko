import * as MailComposer from 'expo-mail-composer';
import { Alert } from 'react-native';

export const sendReportToLab = async (
  recipientEmail: string,
  projectId: string,
  pdfUri: string
) => {
  try {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Email Client Unavailable',
        `Native email client is not configured on this device. You can manually send the generated PDF to: ${recipientEmail}`
      );
      return false;
    }

    const result = await MailComposer.composeAsync({
      recipients: [recipientEmail],
      subject: `Chain of Custody Submission - Project ${projectId}`,
      body: `Hello Laboratory Team,\n\nPlease find attached the Chain of Custody inspection report and sample manifest for Project ${projectId}.\n\nGenerated via Lynko Mobile App.`,
      attachments: [pdfUri],
    });

    if (result.status === MailComposer.MailComposerStatus.SENT) {
      Alert.alert('Success', 'Chain of Custody PDF sent to laboratory successfully!');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to send email:', error);
    Alert.alert('Email Error', 'Failed to trigger native email composer.');
    return false;
  }
};
