import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";

interface ExpandableLanguagesProps {
  languages: Array<{ name: string }>;
}

export function ExpandableLanguages({ languages }: ExpandableLanguagesProps) {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const displayedLanguages = isExpanded ? languages : languages.slice(0, 4);
  const hasMore = languages.length > 4;

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.languagesContainer}>
      <View style={styles.languageChipsContainer}>
        {displayedLanguages.map((lang, langIndex) => (
          <Chip key={langIndex} mode="outlined" compact style={styles.languageChip}>
            {lang.name}
          </Chip>
        ))}
      </View>
      {hasMore && (
        <TouchableOpacity
          onPress={toggleExpansion}
          style={styles.expandButton}
        >
          <Text variant="bodySmall" style={[styles.expandText, { color: colors.primary }]}>
            {isExpanded ? 'Show less' : `+${languages.length - 4} more`}
          </Text>
          <MaterialCommunityIcons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  languagesContainer: {
    marginTop: 12,
  },
  languageChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  languageChip: {
    backgroundColor: 'transparent',
    elevation: 1,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  expandText: {
    marginRight: 4,
    fontWeight: '500',
  },
});
