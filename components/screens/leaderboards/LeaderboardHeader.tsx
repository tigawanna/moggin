import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Menu, Surface, Text } from "react-native-paper";

interface LeaderboardHeaderProps {
  selectedPeriod: 'week' | 'month' | 'year';
  setSelectedPeriod: (period: 'week' | 'month' | 'year') => void;
  selectedCountry: string | null;
  setSelectedCountry: (country: string | null) => void;
  currentUser: any;
}

const PERIOD_OPTIONS = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
] as const;

const COUNTRY_OPTIONS = [
  { value: null, label: 'All Countries' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'AU', label: 'Australia' },
  { value: 'BR', label: 'Brazil' },
  { value: 'IN', label: 'India' },
  { value: 'CN', label: 'China' },
];

export function LeaderboardHeader({ 
  selectedPeriod, 
  setSelectedPeriod, 
  selectedCountry, 
  setSelectedCountry, 
  currentUser 
}: LeaderboardHeaderProps) {
  const [periodMenuVisible, setPeriodMenuVisible] = useState(false);
  const [countryMenuVisible, setCountryMenuVisible] = useState(false);

  const selectedPeriodLabel = PERIOD_OPTIONS.find(option => option.value === selectedPeriod)?.label;
  const selectedCountryLabel = COUNTRY_OPTIONS.find(option => option.value === selectedCountry)?.label;

  return (
    <>
      <Surface style={styles.header} elevation={0}>
        <Text variant="headlineMedium" style={styles.title}>
          Wakatime Leaderboard
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Top coding time in your selected period and region
        </Text>
      </Surface>

      <Surface style={styles.filtersContainer} elevation={0}>
        <View style={styles.selectorsRow}>
          {/* Period Selector */}
          <View style={styles.selectorContainer}>
            <Text variant="labelMedium" style={styles.selectorLabel}>Period</Text>
            <Menu
              visible={periodMenuVisible}
              onDismiss={() => setPeriodMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setPeriodMenuVisible(true)}
                  style={styles.selectorButton}
                  contentStyle={styles.selectorButtonContent}
                >
                  {selectedPeriodLabel}
                </Button>
              }
            >
              {PERIOD_OPTIONS.map((option) => (
                <Menu.Item
                  key={option.value}
                  onPress={() => {
                    setSelectedPeriod(option.value);
                    setPeriodMenuVisible(false);
                  }}
                  title={option.label}
                />
              ))}
            </Menu>
          </View>

          {/* Country Selector */}
          <View style={styles.selectorContainer}>
            <Text variant="labelMedium" style={styles.selectorLabel}>Country</Text>
            <Menu
              visible={countryMenuVisible}
              onDismiss={() => setCountryMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setCountryMenuVisible(true)}
                  style={styles.selectorButton}
                  contentStyle={styles.selectorButtonContent}
                >
                  {selectedCountryLabel}
                </Button>
              }
            >
              {COUNTRY_OPTIONS.map((option) => (
                <Menu.Item
                  key={option.value || 'all'}
                  onPress={() => {
                    setSelectedCountry(option.value);
                    setCountryMenuVisible(false);
                  }}
                  title={option.label}
                />
              ))}
            </Menu>
          </View>
        </View>
      </Surface>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  selectorsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  selectorContainer: {
    flex: 1,
  },
  selectorLabel: {
    marginBottom: 4,
    opacity: 0.8,
  },
  selectorButton: {
    justifyContent: 'flex-start',
  },
  selectorButtonContent: {
    justifyContent: 'flex-start',
  },
});
