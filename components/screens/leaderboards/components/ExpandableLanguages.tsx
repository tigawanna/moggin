import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface ExpandableLanguagesProps {
  languages: Array<{ name: string; percent?: number; hours?: number; minutes?: number; }>;
}

export function ExpandableLanguages({ languages }: ExpandableLanguagesProps) {
  const { colors } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  
  const animationProgress = useSharedValue(0);
  const hasMore = languages.length > 3;

  const toggleExpansion = () => {
    if (isExpanded) {
      // Collapsing
      animationProgress.value = withTiming(0, { duration: 250 }, () => {
        runOnJS(setShowHidden)(false);
      });
      setIsExpanded(false);
    } else {
      // Expanding
      setShowHidden(true);
      setIsExpanded(true);
      animationProgress.value = withTiming(1, { duration: 250 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );
    
    const scale = interpolate(
      animationProgress.value,
      [0, 1],
      [0.8, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const getLanguageIcon = (langName: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    const lang = langName.toLowerCase();
    switch (lang) {
      case 'javascript':
      case 'js':
        return 'language-javascript';
      case 'typescript':
      case 'ts':
        return 'language-typescript';
      case 'python':
        return 'language-python';
      case 'java':
        return 'language-java';
      case 'kotlin':
        return 'language-kotlin';
      case 'swift':
        return 'language-swift';
      case 'dart':
        return 'file-code';
      case 'c++':
      case 'cpp':
        return 'language-cpp';
      case 'c#':
      case 'csharp':
        return 'language-csharp';
      case 'php':
        return 'language-php';
      case 'go':
        return 'language-go';
      case 'rust':
        return 'language-rust';
      case 'html':
        return 'language-html5';
      case 'css':
        return 'language-css3';
      case 'vue':
        return 'vuejs';
      case 'react':
        return 'react';
      default:
        return 'code-tags';
    }
  };

  const getLanguageColor = (langName: string) => {
    const lang = langName.toLowerCase();
    switch (lang) {
      case 'javascript':
      case 'js':
        return '#F7DF1E';
      case 'typescript':
      case 'ts':
        return '#3178C6';
      case 'python':
        return '#3776AB';
      case 'java':
        return '#ED8B00';
      case 'kotlin':
        return '#7F52FF';
      case 'swift':
        return '#FA7343';
      case 'dart':
        return '#0175C2';
      case 'c++':
      case 'cpp':
        return '#00599C';
      case 'c#':
      case 'csharp':
        return '#239120';
      case 'php':
        return '#777BB4';
      case 'go':
        return '#00ADD8';
      case 'rust':
        return '#000000';
      case 'html':
        return '#E34F26';
      case 'css':
        return '#1572B6';
      case 'vue':
        return '#4FC08D';
      case 'react':
        return '#61DAFB';
      default:
        return colors.primary;
    }
  };

  return (
    <View style={styles.languagesContainer}>
      <Text variant="labelMedium" style={[styles.sectionTitle, { color: colors.onSurfaceVariant }]}>
        Languages
      </Text>
      
      <View style={styles.languageChipsContainer}>
        {languages.slice(0, 3).map((lang, langIndex) => {
          const langColor = getLanguageColor(lang.name);
          return (
            <Chip 
              key={langIndex} 
              mode="flat" 
              compact 
              style={[
                styles.languageChip, 
                { 
                  backgroundColor: `${langColor}20`, // 20% opacity
                  borderColor: langColor,
                  borderWidth: 1,
                }
              ]}
              textStyle={{ color: langColor, fontWeight: '600' }}
              icon={() => (
                <MaterialCommunityIcons 
                  name={getLanguageIcon(lang.name)} 
                  size={14} 
                  color={langColor} 
                />
              )}
            >
              {lang.name}
            </Chip>
          );
        })}
      </View>
      
      {hasMore && showHidden && (
        <Animated.View style={[styles.hiddenLanguagesContainer, animatedStyle]}>
          <View style={styles.languageChipsContainer}>
            {languages.slice(3).map((lang, langIndex) => {
              const langColor = getLanguageColor(lang.name);
              return (
                <Chip 
                  key={`hidden-${langIndex}`} 
                  mode="flat" 
                  compact 
                  style={[
                    styles.languageChip, 
                    { 
                      backgroundColor: `${langColor}20`, // 20% opacity
                      borderColor: langColor,
                      borderWidth: 1,
                    }
                  ]}
                  textStyle={{ color: langColor, fontWeight: '600' }}
                  icon={() => (
                    <MaterialCommunityIcons 
                      name={getLanguageIcon(lang.name)} 
                      size={14} 
                      color={langColor} 
                    />
                  )}
                >
                  {lang.name}
                </Chip>
              );
            })}
          </View>
        </Animated.View>
      )}
      
      {hasMore && (
        <TouchableOpacity
          onPress={toggleExpansion}
          style={[styles.expandButton, { backgroundColor: colors.surfaceVariant }]}
        >
          <Text variant="bodySmall" style={[styles.expandText, { color: colors.primary }]}>
            {isExpanded ? 'Show less' : `+${languages.length - 3} more`}
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
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  languageChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  hiddenLanguagesContainer: {
    marginTop: 4,
  },
  languageChip: {
    backgroundColor: 'transparent',
    elevation: 0,
    borderRadius: 20,
    marginVertical: 2,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 4,
    borderRadius: 12,
  },
  expandText: {
    marginRight: 4,
    fontWeight: '500',
  },
});
