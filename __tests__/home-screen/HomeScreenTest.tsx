import { HomeScreenComponent } from "@/components/screens/home/HomeScreenComponent";
import { render, screen } from "@testing-library/react-native";

test("basic test", () => {
  render(<HomeScreenComponent />);
  expect(screen.getAllByRole("button", { name: "start" })).toBeOnTheScreen();
});
