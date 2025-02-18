import { Box, Typography, Divider, Button } from "@mui/material";
import Image from "next/image";
import React from "react";

const Marketplace = ({ data }) => {
  return (
    <Box my={4}>
      <Typography variant="body1" fontWeight="bold">
        You can also purchase this product from the following online stores:
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
        {data.marketplaceLinks?.amazon && data.marketplaceLinks?.amazon !== "NA" && (
          <Button
            component="a"
            href={data.marketplaceLinks.amazon}
            target="_blank"
            rel="noopener"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textTransform: "none",
            }}
          >
            <Image
              src="/images/brands/amazon.png"
              width={40}
              height={40}
              quality={100}
              alt="Amazon"
            />
            <Typography variant="body1" fontWeight="bold">
              Buy on <span style={{ color: "#0073e6", textDecoration: "underline" }}>Amazon</span>
            </Typography>
          </Button>
        )}

        {data.marketplaceLinks?.flipkart && data.marketplaceLinks?.flipkart !== "NA" && (
          <Button
            component="a"
            href={data.marketplaceLinks.flipkart}
            target="_blank"
            rel="noopener"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textTransform: "none",
            }}
          >
            <Image
              src="/images/brands/flipkart.png"
              width={40}
              height={40}
              quality={100}
              alt="Flipkart"
            />
            <Typography variant="body1" fontWeight="bold">
              Buy on <span style={{ color: "#0073e6", textDecoration: "underline" }}>Flipkart</span>
            </Typography>
          </Button>
        )}

        {data.marketplaceLinks?.myntra && data.marketplaceLinks?.myntra !== "NA" && (
          <Button
            component="a"
            href={data.marketplaceLinks.myntra}
            target="_blank"
            rel="noopener"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textTransform: "none",
            }}
          >
            <Image
              src="/images/brands/myntra.png"
              width={40}
              height={40}
              quality={100}
              alt="Myntra"
            />
            <Typography variant="body1" fontWeight="bold">
              Buy on <span style={{ color: "#0073e6", textDecoration: "underline" }}>Myntra</span>
            </Typography>
          </Button>
        )}

        {data.marketplaceLinks?.meesho && (
          <Button
            component="a"
            href={data.marketplaceLinks.meesho}
            target="_blank"
            rel="noopener"
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "none",
            }}
          >
            <Image
              src="/images/brands/meesho.png"
              width={60}
              height={60}
              quality={100}
              alt="Meesho"
            />
          </Button>
        )}
      </Box>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default Marketplace;