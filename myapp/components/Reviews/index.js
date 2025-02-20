import Image from "next/image";
import React, { useState, useEffect } from "react";
import { BiSolidStar } from "react-icons/bi";
import { API_URL } from "../../../config";
import { GoCheckCircleFill } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { Modal, Box, Grid, Card, CardContent, Typography, Button } from "@mui/material";

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
    <div className="flex flex-col mt-4">
      <Typography variant="h4" fontWeight="bold" className="mb-4">
        Customer Reviews
      </Typography>

      <Grid container spacing={2}>
        {displayedReviews.map((review, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="cursor-pointer" onClick={() => openReviewModal(review)}>
              {review.media && review.media.length > 0 && (
                <Image
                  src={review.media[0].url ? `${API_URL + review.media[0].url}` : "/images/nofoto.jpg"}
                  width={250}
                  height={250}
                  className="w-full object-cover"
                  alt="Review Image"
                />
              )}
              <CardContent>
                <Typography variant="h6" className="flex items-center gap-2">
                  {review.name.length > 11 ? `${review.name.slice(0, 11)}...` : review.name}
                  {review.verified && <GoCheckCircleFill />}
                </Typography>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <BiSolidStar key={i} className="w-5 h-5" fill={i < review.rating ? "#f59e0b" : "#d1d5db"} />
                  ))}
                </div>
                <Typography variant="body2" color="textSecondary">
                  {review.reviewText.length > 100 ? `${review.reviewText.slice(0, 100)}...` : review.reviewText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {showMore && (
        <Button variant="outlined" className="mt-4" onClick={loadMoreReviews}>
          Load More Reviews
        </Button>
      )}

      {/* Review Modal */}
      <Modal open={isModalOpen} onClose={closeReviewModal}>
        <Box className="p-6 bg-white rounded-lg max-w-lg mx-auto mt-20 shadow-lg">
          {selectedReview && (
            <>
              <Typography variant="h6" className="flex items-center gap-2">
                {selectedReview.name} {selectedReview.verified && <GoCheckCircleFill />}
                {selectedReview.verified && <span className="text-sm">Verified Purchase</span>}
              </Typography>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <BiSolidStar key={i} className="w-5 h-5" fill={i < selectedReview.rating ? "#f59e0b" : "#d1d5db"} />
                ))}
              </div>
              {selectedReview.media && selectedReview.media.length > 0 && (
                <div className="mb-4">
                  {selectedReview.media.map((image) => (
                    <Image
                      key={image.url}
                      src={image.url ? `${API_URL + image.url}` : "/images/nofoto.jpg"}
                      width={400}
                      height={400}
                      className="w-full object-cover mb-2"
                      alt="Review Image"
                    />
                  ))}
                </div>
              )}
              <Typography variant="body1" color="textSecondary" className="mb-4">
                {selectedReview.reviewText}
              </Typography>
              <div className="flex justify-end mt-4">
                <Button variant="contained" color="primary" onClick={closeReviewModal}>
                  Close
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Reviews;