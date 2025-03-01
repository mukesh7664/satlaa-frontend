import { Box, Button, Divider, Typography } from "@mui/material";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import React from "react";

const MoreInfo = ({ path }) => {
  return (
    <>
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        {/* WhatsApp Chat Button */}
        <Button
          component="a"
          href={`https://api.whatsapp.com/send?phone=919257120925&text=I%20want%20to%20know%20about%20https://satlaa.com${path}`}
          target="_blank"
          rel="noreferrer"
          startIcon={<FaWhatsapp />}
          sx={{
            backgroundColor: "#25D366",
            color: "white",
            "&:hover": {
              backgroundColor: "white",
              color: "#25D366",
              border: "1px solid #25D366",
            },
            px: 3,
            py: 1.5,
            fontSize: "1rem",
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          Chat for More Info
        </Button>

        {/* Call Info */}
        <Typography variant="body1">
          Or call us on{" "}
          <a href="tel:+919257120925" style={{ textDecoration: "underline", color: "#0073e6" }}>
            +91 925-7120-925
          </a>
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Instagram Community */}
      <Box display="flex" alignItems="center">
        <Typography variant="body1">Join 120K+ Insta Community</Typography>
        <Button
          component="a"
          href="https://instagram.com/satlaa.in"
          target="_blank"
          rel="noreferrer"
          startIcon={<FaInstagram />}
          sx={{
            textTransform: "none",
            color: "#E1306C",
            textDecoration: "underline",
            ml: 1,
          }}
        >
          SATLAA.in
        </Button>
      </Box>
    </>
  );
};

export default MoreInfo;