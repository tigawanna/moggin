import { importWidgetFiles } from "@/modules/expo-glance-widget/plugins/utils/importWidgetFiles";

function run() {
  importWidgetFiles({
    includeDirectories: ["wakatime"],
    widgetsSourceBasePath:
      "C:\\Users\\user\\AndroidStudioProjects\\Bidii-kotlin-widget\\app\\src\\main\\java\\com\\tigawanna\\bidii",
    destinationBasePath: "./test-widget-destination",
    destinationPackageName: "com.anonymous.bidii",
  });

}

run();
