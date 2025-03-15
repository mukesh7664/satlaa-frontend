"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { BiSolidStar } from "react-icons/bi";
import { API_URL } from "../../../config";
import { GoCheckCircleFill } from "react-icons/go";
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Typography,
  Button,
  Container,
  Box
} from "@mui/material";

const Reviews = ({ reviews }) => {
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const reviewsPerPage = 10;

  useEffect(() => {
    setDisplayedReviews(reviews.slice(0, reviewsPerPage));
  }, [reviews]);

  const loadMoreReviews = () => {
    const currentLength = displayedReviews.length;
    const newReviews = reviews.slice(currentLength, currentLength + reviewsPerPage);
    setDisplayedReviews([...displayedReviews, ...newReviews]);
    if (currentLength + reviewsPerPage >= reviews.length) {
      setShowMore(false);
    }
  };

  const openReviewModal = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Customer Reviews
      </Typography>

      <Grid container spacing={2}>
        {displayedReviews.map((review, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ cursor: "pointer" }} onClick={() => openReviewModal(review)}>
              {review.media?.length > 0 && (
                <CardMedia
                  component="img"
                  height="250"
                  image={review.media[0].url ? `${API_URL + review.media[0].url}` : "/images/nofoto.jpg"}
                  alt="Review Image"
                />
              )}
              <CardContent>
                <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                  {review.name.length > 11 ? `${review.name.slice(0, 11)}...` : review.name}
                  {review.verified && <GoCheckCircleFill />}
                </Typography>
                <Box display="flex" mb={1}>
                  {[...Array(5)].map((_, i) => (
                    <BiSolidStar key={i} style={{ width: 20, height: 20, color: i < review.rating ? "#f59e0b" : "#d1d5db" }} />
                  ))}
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {review.reviewText.length > 100 ? `${review.reviewText.slice(0, 100)}...` : review.reviewText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {showMore && (
        <Button variant="outlined" sx={{ mt: 3 }} onClick={loadMoreReviews}>
          Load More Reviews
        </Button>
      )}

      {/* Review Modal */}
      <Dialog open={isModalOpen} onClose={closeReviewModal} maxWidth="sm" fullWidth>
        {selectedReview && (
          <>
            <DialogTitle display="flex" alignItems="center" gap={1}>
              {selectedReview.name} {selectedReview.verified && <GoCheckCircleFill />}
              {selectedReview.verified && <Typography variant="body2">Verified Purchase</Typography>}
            </DialogTitle>
            <DialogContent>
              <Box display="flex" mb={2}>
                {[...Array(5)].map((_, i) => (
                  <BiSolidStar key={i} style={{ width: 20, height: 20, color: i < selectedReview.rating ? "#f59e0b" : "#d1d5db" }} />
                ))}
              </Box>
              {selectedReview.media?.length > 0 && (
                <Box mb={2}>
                  {selectedReview.media.map((image) => (
                    <CardMedia
                      key={image.url}
                      component="img"
                      height="400"
                      image={image.url ? `${API_URL + image.url}` : "/images/nofoto.jpg"}
                      alt="Review Image"
                      sx={{ mb: 2, borderRadius: 1 }}
                    />
                  ))}
                </Box>
              )}
              <Typography variant="body1" color="textSecondary">
                {selectedReview.reviewText}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={closeReviewModal}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Reviews;