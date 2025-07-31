import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#10b981', '#059669', '#047857']}
      className="flex-1"
    >
      <ScrollView className="flex-1">
        <View className="px-6 pt-16 pb-8">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white text-2xl font-bold">
                Welcome back!
              </Text>
              <Text className="text-green-100 text-base">
                {user?.username || 'Secure User'}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={handleLogout}
              className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg"
            >
              <Text className="text-2xl">👤</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white/20 rounded-xl p-4 border border-white/30">
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-green-400 rounded-full mr-3"></View>
              <Text className="text-white font-semibold">Account Secured</Text>
            </View>
            <Text className="text-green-100 text-sm mt-1">
              Multi-factor authentication is active
            </Text>
          </View>
        </View>

        <View className="flex-1 px-6 py-8">
          <View className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
            <Text className="text-white font-bold text-lg mb-4">Account Information</Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between items-center py-2 border-b border-white/20">
                <Text className="text-green-100 font-medium">Username</Text>
                <Text className="text-white font-semibold">{user?.username}</Text>
              </View>
              
              <View className="flex-row justify-between items-center py-2 border-b border-white/20">
                <Text className="text-green-100 font-medium">Email</Text>
                <Text className="text-white font-semibold">{user?.email}</Text>
              </View>
              
              <View className="flex-row justify-between items-center py-2">
                <Text className="text-green-100 font-medium">Email Verified</Text>
                <View className="flex-row items-center">
                  <Text className="text-green-300 mr-2">✓</Text>
                  <Text className="text-green-300 font-semibold">Verified</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
