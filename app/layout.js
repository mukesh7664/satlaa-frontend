import "../assets/styles/global.scss";
import { fontVariables } from "../util/fonts";
import { metadata, viewport } from "./metadata"; // ✅ Import metadata
import ReduxProvider from "../redux/ReduxProvider"; // ✅ Redux wrapper
import AppLayout from "../myapp/core/Layout";

export { metadata, viewport }; // ✅ Export metadata from a non-client file

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fontVariables.join(" ")} `}>
        <ReduxProvider>
          <AppLayout>{children}</AppLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}