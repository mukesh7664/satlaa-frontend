import Image from "next/image";
import React, { useState, useEffect } from "react";
import { BiSolidStar } from "react-icons/bi";
import { API_URL } from "../../../../config";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { GoCheckCircleFill } from "react-icons/go";
import { Modal } from 'antd';
import { IoClose } from "react-icons/io5";

const Reviews = ({ reviews }) => {
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const reviewsPerPage = 10;

  useEffect(() => {
    setDisplayedReviews(reviews.slice(0, reviewsPerPage));
  }, [reviews]);

  const loadMoreReviews = () => {
    const currentLength = displayedReviews.length;
    const newReviews = reviews.slice(
      currentLength,
      currentLength + reviewsPerPage
    );
    setDisplayedReviews([...displayedReviews, ...newReviews]);
    if (currentLength + reviewsPerPage >= reviews.length) {
      setShowMore(false);
    }
  };

  const openReviewModal = (review) => {
    setSelectedReview(review);
    setIsModalVisible(true);
  };

  const closeReviewModal = () => {
    setIsModalVisible(false);
  };

  const ReviewModal = ({ review, visible, onClose }) => {
    if (!review) return null;

    return (
      <Modal
        visible={visible}
        onCancel={onClose}
        footer={null}
        width={800}
        bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
        closeIcon={<IoClose className="text-2xl" />}
      >
        <div className="p-6">
          <p className="text-lg font-semibold flex gap-x-2 items-center">
            {review.name} {review.verified && <GoCheckCircleFill />}{" "}
           
            {review.verified && (
              <span className="text-sm">Verified Purchase</span>
            )}{" "}
          </p>
          <div className="flex mb-2">
            {[...Array(5)].map((_, i) => (
              <BiSolidStar
                key={i}
                className="w-5 h-5"
                fill={i < review.rating ? "#f59e0b" : "#d1d5db"}
              />
            ))}
          </div>
          {review.media && review.media.length > 0 && (
            <div className="mb-4">
              {review.media.map((image) => (
                <Image
                  key={image.url}
                  src={
                    image.url ? `${API_URL + image.url}` : "/images/nofoto.jpg"
                  }
                  width={400}
                  height={400}
                  className="w-full object-cover mb-2"
                  alt="Review Image"
                />
              ))}
            </div>
          )}
          <p className="text-gray-700 mb-4">{review.reviewText}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="flex flex-col mt-4">
      <p className="text-2xl font-bold mb-4 w-full">Customer Reviews</p>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 3 }}>
        <Masonry className="" gutter="10px">
          {displayedReviews.map((review, index) => (
            <div
              key={index}
              className="my-masonry-column bg-white rounded overflow-hidden flex flex-col cursor-pointer"
              onClick={() => openReviewModal(review)}
            >
              {review.media && review.media.length > 0 && (
                <Image
                  src={
                    review.media[0].url
                      ? `${API_URL + review.media[0].url}`
                      : "/images/nofoto.jpg"
                  }
                  width={250}
                  height={250}
                  className="w-full bg-center transition-all object-cover"
                  alt="Review Image"
                />
              )}
              <div className="grid-item-content p-2">
                <p className="text-lg font-semibold flex gap-x-2 items-center">
                {review.name.length > 11
                    ? `${review.name.slice(0, 11)}...`
                    : review.name}   {review.verified && <GoCheckCircleFill />}

                </p>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <BiSolidStar
                      key={i}
                      className="w-5 h-5"
                      fill={i < review.rating ? "#f59e0b" : "#d1d5db"}
                    />
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-2 mt-2">
                  {review.reviewText.length > 100
                    ? `${review.reviewText.slice(0, 100)}...`
                    : review.reviewText}
                </p>
              </div>
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
      {showMore && (
        <button
          onClick={loadMoreReviews}
          className="mt-4 px-4 py-2 border text-primary rounded text-xl"
        >
          Load More Reviews
        </button>
      )}
      <ReviewModal review={selectedReview} visible={isModalVisible} onClose={closeReviewModal} />
    </div>
  );
};

export default Reviews;