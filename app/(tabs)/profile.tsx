import React from 'react';
import { View, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Phone, Mail, MapPin, History, Bell, Settings, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user } = useApp();

  if (!user) {
    return (
      <View style={styles.container}>
        <Typography variant="h3">Please log in to view your profile</Typography>
      </View>
    );
  }

  const profileItems = [
    {
      id: 'payment',
      title: 'Payment Methods',
      icon: <CreditCard size={24} color={COLORS.primary.main} />,
      onPress: () => {},
    },
    {
      id: 'history',
      title: 'Travel History',
      icon: <History size={24} color={COLORS.primary.main} />,
      onPress: () => {},
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      icon: <Bell size={24} color={COLORS.primary.main} />,
      onPress: () => {},
    },
    {
      id: 'settings',
      title: 'Account Settings',
      icon: <Settings size={24} color={COLORS.primary.main} />,
      onPress: () => {},
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: <LogOut size={24} color={COLORS.error.main} />,
      onPress: () => {},
      danger: true,
    },
  ];

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300' }}
              style={styles.avatar}
            />
          </View>
          <Typography variant="h2" style={styles.name}>{user.name}</Typography>
          <Typography variant="body" color="secondary">{user.email}</Typography>
        </View>

        <Card style={styles.personalInfoCard}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Personal Information
          </Typography>
          
          <Input
            label="Full Name"
            value={user.name}
            editable={false}
            containerStyle={styles.input}
          />
          
          <Input
            label="Email"
            value={user.email}
            leftIcon={<Mail size={20} color={COLORS.primary.main} />}
            editable={false}
            containerStyle={styles.input}
          />
          
          <Input
            label="Phone"
            value="+62 812 3456 7890"
            leftIcon={<Phone size={20} color={COLORS.primary.main} />}
            editable={false}
            containerStyle={styles.input}
          />
          
          <Input
            label="Address"
            value="Jakarta, Indonesia"
            leftIcon={<MapPin size={20} color={COLORS.primary.main} />}
            editable={false}
            containerStyle={styles.lastInput}
          />
          
          <Button
            title="Edit Profile"
            variant="outline"
            size="medium"
            fullWidth
            style={styles.editButton}
          />
        </Card>

        <View style={styles.menuSection}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Account Settings
          </Typography>
          
          {profileItems.map((item) => (
            <Card
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemIcon}>
                  {item.icon}
                </View>
                <Typography 
                  variant="body" 
                  color={item.danger ? 'error' : 'primary'}
                  weight="semibold"
                >
                  {item.title}
                </Typography>
              </View>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// We need to import this separately because it's not in the lucide-react-native package
function CreditCard({ size, color }: { size: number, color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },
  container: {
    flex: 1,
    padding: SPACING.m,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : undefined,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: SPACING.m,
    borderWidth: 3,
    borderColor: COLORS.primary.main,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginBottom: SPACING.xs,
  },
  personalInfoCard: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    marginBottom: SPACING.m,
  },
  input: {
    marginBottom: SPACING.m,
  },
  lastInput: {
    marginBottom: SPACING.l,
  },
  editButton: {
    marginTop: SPACING.m,
  },
  menuSection: {
    marginBottom: SPACING.l,
  },
  menuItem: {
    marginBottom: SPACING.s,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: SPACING.m,
    width: 40,
    alignItems: 'center',
  },
});