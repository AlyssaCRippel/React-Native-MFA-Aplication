import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

interface EmailVerificationScreenProps {
  navigation: any;
  route: any;
}

export const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  const { verifyEmail, resendCode } = useAuth();
  const { email, message } = route.params || {};

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyCode = async () => {
    if (!code.trim() || code.trim().length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      await verifyEmail(code.trim());
      Alert.alert(
        'Success!', 
        'Email verified successfully. Welcome to your secure account!',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error: any) {
      const errorMessage = error.message || 'Invalid verification code. Please try again.';
      setError(errorMessage);
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError('');
    
    try {
      await resendCode();
      setCountdown(60);
      Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
    } catch (error: any) {
      Alert.alert('Resend Failed', error.message || 'Unable to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const formatCode = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 6);
    setCode(cleaned);
    if (cleaned.length === 6) {
      setError('');
    }
  };

  return (
    <LinearGradient
      colors={['#10b981', '#059669', '#047857']}
      className="flex-1"
    >
      <View className="flex-1 justify-center px-8">
        <View className="items-center mb-8">
          <Text className="text-white text-3xl font-bold mb-2">Check Your Email</Text>
          <Text className="text-green-100 text-base text-center mb-4">
            We've sent a 6-digit verification code to:
          </Text>
          <Text className="text-white font-semibold text-base">
            {email || 'your email address'}
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-xl mb-6">
          <Text className="text-gray-700 text-sm text-center mb-6">
            Enter the verification code to complete your sign-in
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2 text-base">Verification Code</Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
              <TextInput
                className="flex-1 text-gray-900 text-center"
                value={code}
                onChangeText={formatCode}
                placeholder="000000"
                keyboardType="numeric"
                maxLength={6}
                style={{ 
                  fontSize: 24, 
                  fontWeight: 'bold', 
                  letterSpacing: 8,
                  textAlign: 'center'
                }}
                placeholderTextColor="#9ca3af"
              />
            </View>
            {error && (
              <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>
            )}
          </View>

          <TouchableOpacity
            className={`rounded-xl px-6 py-4 flex-row items-center justify-center mt-2 ${
              loading || code.length !== 6 ? 'bg-gray-400' : 'bg-green-600'
            }`}
            onPress={handleVerifyCode}
            disabled={loading || code.length !== 6}
          >
            {loading && (
              <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
            )}
            <Text className="text-white font-semibold text-lg">Verify Code</Text>
          </TouchableOpacity>

          <View className="items-center mt-6 pt-4 border-t border-gray-200">
            <Text className="text-gray-600 text-sm mb-3">
              Didn't receive the code?
            </Text>
            
            {countdown > 0 ? (
              <Text className="text-green-600 font-medium">
                Resend available in {countdown}s
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={resendLoading}
                className="px-4 py-2"
              >
                <Text className="text-green-600 font-semibold text-base underline">
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="items-center">
          <TouchableOpacity
            className="rounded-xl px-6 py-3 border border-white"
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-white font-semibold text-base">Back to Login</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center mt-8">
          <Text className="text-green-100 text-xs text-center max-w-xs">
            This code expires in 5 minutes for your security
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

