import "../assets/styles/global.scss";
import { fontVariables } from "../util/fonts";
import { metadata, viewport } from "./metadata"; // ✅ Import metadata
import ReduxProvider from "../redux/ReduxProvider"; // ✅ Redux wrapper
import AppLayout from "../myapp/core/Layout";
import { Toaster } from "sonner";

export { metadata, viewport }; // ✅ Export metadata from a non-client file

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fontVariables.join(" ")} `}>
        <ReduxProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster position="top-right" richColors />
        </ReduxProvider>
      </body>
    </html>
  );
}