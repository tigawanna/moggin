import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, ScrollView } from "react-native";
import { Button, Card, Surface, Text, useTheme, Chip, Avatar } from "react-native-paper";

export default function ExploreScreen() {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.chipContainer} elevation={0}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}>
          <Chip style={styles.chip} icon="food" onPress={() => {}}>
            Food
          </Chip>
          <Chip style={styles.chip} icon="hiking" onPress={() => {}}>
            Outdoor
          </Chip>
          <Chip style={styles.chip} icon="palette" onPress={() => {}}>
            Arts
          </Chip>
          <Chip style={styles.chip} icon="music" onPress={() => {}}>
            Music
          </Chip>
          <Chip style={styles.chip} icon="coffee" onPress={() => {}}>
            Cafés
          </Chip>
        </ScrollView>
      </Surface>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Popular Near You
      </Text>

      <Card style={styles.card} mode="elevated">
        <Card.Cover source={{ uri: "https://picsum.photos/700/300?random=1" }} />
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons name="star" size={24} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>
            Mountain Trail Hike
          </Text>
          <Text variant="bodyMedium">Experience breathtaking views just 20 minutes away</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="text">View Details</Button>
          <Button mode="contained-tonal" icon="bookmark-outline">
            Save
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card} mode="elevated">
        <Card.Cover source={{ uri: "https://picsum.photos/700/300?random=2" }} />
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons name="food" size={24} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.cardTitle}>
            Riverside Café
          </Text>
          <Text variant="bodyMedium">Local favorite with seasonal menu and waterfront views</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="text">View Details</Button>
          <Button mode="contained-tonal" icon="bookmark-outline">
            Save
          </Button>
        </Card.Actions>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Events This Week
      </Text>

      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.cardContent}>
          <Surface style={styles.eventHeader} elevation={0}>
            <Avatar.Icon size={48} icon="music" />
            <Surface style={styles.eventInfo} elevation={0}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Local Jazz Festival
              </Text>
              <Text variant="bodySmall" style={styles.dateText}>
                Saturday, 7:00 PM
              </Text>
            </Surface>
          </Surface>
          <Text variant="bodyMedium">
            Enjoy performances from the city&apos;s best jazz musicians
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="text">View Details</Button>
          <Button mode="contained" icon="calendar">
            RSVP
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginVertical: 16,
  },
  title: {
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  chipContainer: {
    marginVertical: 16,
  },
  chipScroll: {
    paddingRight: 16,
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
  },
  cardContent: {
    gap: 8,
    paddingVertical: 16,
  },
  cardTitle: {
    fontWeight: "bold",
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  eventInfo: {
    flex: 1,
  },
  dateText: {
    opacity: 0.7,
  },
});
