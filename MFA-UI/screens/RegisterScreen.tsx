import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { register } = useAuth();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await register(username.trim(), email.trim(), password);
      
      Alert.alert(
        'Registration Successful!', 
        'Your account has been created. You can now sign in.',
        [
          {
            text: 'Sign In Now',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Unable to create account. Please try again.');
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
          <View className="flex-1 justify-center px-8 py-12">
            <View className="items-center mb-8"> 
              <Text className="text-white text-3xl font-bold mb-2">Create Account</Text>
              <Text className="text-green-100 text-base text-center">
                Join us with secure multi-factor authentication
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-6 shadow-xl mb-6">
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2 text-base">Username</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                  
                  <TextInput
                    className="flex-1 text-gray-900 text-base"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Choose a username"
                    autoCapitalize="none"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {errors.username && (
                  <Text className="text-red-500 text-sm mt-1 ml-1">{errors.username}</Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2 text-base">Email Address</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                  <TextInput
                    className="flex-1 text-gray-900 text-base"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1 ml-1">{errors.email}</Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2 text-base">Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                  <TextInput
                    className="flex-1 text-gray-900 text-base"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Create a password"
                    secureTextEntry
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1 ml-1">{errors.password}</Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2 text-base">Confirm Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                  <TextInput
                    className="flex-1 text-gray-900 text-base"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    secureTextEntry
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {errors.confirmPassword && (
                  <Text className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword}</Text>
                )}
              </View>

              <TouchableOpacity
                className={`rounded-xl px-6 py-4 flex-row items-center justify-center mt-2 ${
                  loading ? 'bg-gray-400' : 'bg-green-600'
                }`}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading && (
                  <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
                )}
                <Text className="text-white font-semibold text-lg">Create Account</Text>
              </TouchableOpacity>
            </View>

            <View className="items-center">
              <Text className="text-green-100 text-base mb-4">
                Already have an account?
              </Text>
              <TouchableOpacity
                className="rounded-xl px-6 py-3 border border-white"
                onPress={() => navigation.navigate('Login')}
              >
                <Text className="text-white font-semibold text-base">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};
