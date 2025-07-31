import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!username.trim()) {
      newErrors.username = 'Username or email is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await login(username.trim(), password);
      
      if (response.data?.requiresMFA) {
        navigation.navigate('EmailVerification', {
          email: response.data.email,
          message: response.message
        });
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#10b981', '#059669', '#047857']}
      className="flex-1"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-8">
            <View className="items-center mb-12">
              <Text className="text-white text-3xl font-bold mb-2">Welcome Back</Text>
              <Text className="text-green-100 text-base text-center">
                Sign in to your secure account
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-xl mb-6">
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2 text-base">Username or Email</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                  <TextInput
                    className="flex-1 text-gray-900 text-base"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username or email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {errors.username && (
                  <Text className="text-red-500 text-sm mt-1 ml-1">{errors.username}</Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2 text-base">Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                  <TextInput
                    className="flex-1 text-gray-900 text-base"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1 ml-1">{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity
                className={`rounded-xl px-6 py-4 flex-row items-center justify-center mt-2 ${
                  loading ? 'bg-gray-400' : 'bg-green-600'
                }`}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading && (
                  <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
                )}
                <Text className="text-white font-semibold text-lg">Sign In</Text>
              </TouchableOpacity>
            </View>

            <View className="items-center">
              <Text className="text-green-100 text-base mb-4">
                Don't have an account?
              </Text>
              <TouchableOpacity
                className="rounded-xl px-6 py-3 border border-white"
                onPress={() => navigation.navigate('Register')}
              >
                <Text className="text-white font-semibold text-base">Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};
