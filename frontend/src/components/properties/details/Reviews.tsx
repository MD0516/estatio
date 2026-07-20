"use client"
import { useAppContext } from '@/context/AppContext'
import { useAddReview, useReviews, useToggleHelpful } from '@/hooks/useReview'
import { Review } from '@/types'
import React, { useState } from 'react'
import { AiFillLike } from 'react-icons/ai'
import { BiStar, BiTime, BiLike, BiDislike, BiMessageDetail } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'

type ReviewProp = {
    userId: number,
    propertyId: number,
}

const Reviews = ({
    userId,
    propertyId
}: Readonly<ReviewProp>) => {
    const { user } = useAppContext()
    const { data: reviews = [], isLoading } = useReviews(propertyId)
    const { mutate: addReview, isPending } = useAddReview()
    const { mutate: toggleHelpful } = useToggleHelpful()
    const [newReview, setNewReview] = useState('')
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    const isReviewExists = reviews.map(r => r.userId).includes(user?.id)
    
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length).toFixed(1)
        : '0.0'
    const totalReviews = reviews.length

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newReview.trim() || rating === 0) return

        const payload = {
            propertyId,
            stars: rating,
            note: newReview
        }

        addReview(payload)
    }

    const handleHelpful = (reviewId: number) => {
        toggleHelpful({ reviewId, propertyId })
    }

    const formatDate = (date: string) => {
        const d = new Date(date)
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }
        return d.toLocaleDateString('en-US', options)
    }

    const renderStars = (stars: number, interactive = false) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => interactive && setRating(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        className={interactive ? 'cursor-pointer' : 'cursor-default'}
                    >
                        <BiStar
                            className={`w-5 h-5 ${star <= (interactive ? hoverRating || rating : stars)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                                }`}
                        />
                    </button>
                ))}
            </div>
        )
    }

    return (
        <div className="reviews-section max-w-4xl mx-auto px-4 py-8">
            {/* Header with Stats */}
            <div className="header mb-8 pb-6 border-bottom-border-light">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-1">
                            Reviews & Ratings
                        </h3>
                        <p className="text-text/60 text-sm">
                            {totalReviews > 0
                                ? `${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'} from verified residents`
                                : 'No reviews yet'}
                        </p>
                    </div>
                    {totalReviews > 0 && (
                        <div className="flex items-center gap-4 bg-surface px-4 py-2 rounded-lg border border-border-light">
                            <div className="text-3xl font-bold text-primary">{averageRating}</div>
                            <div>
                                {renderStars(Number(averageRating))}
                                <p className="text-xs text-text/60 mt-0.5">Average Rating</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Empty State - No Reviews */}
            {totalReviews === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-surface/30 rounded-xl border border-border-light border-dashed mb-8">
                    <div className="w-20 h-20 bg-primary-subtle rounded-full flex items-center justify-center mb-4">
                        <BiMessageDetail className="w-10 h-10 text-primary/40" />
                    </div>
                    <h4 className="text-xl font-semibold text-primary mb-2">No Reviews Yet</h4>
                    {user?.id !== userId && (
                        <p className="text-text/60 max-w-md mb-6">
                            Be the first to share your experience with this property and help others make informed decisions.
                        </p>
                    )}
                    {user?.id !== userId && (
                        <button
                            onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all duration-200"
                        >
                            Write a Review
                        </button>
                    )}
                </div>
            )}

            {/* Write Review Form */}
            {user?.id == userId || !isReviewExists && (
                <div id="review-form" className="review-form bg-surface rounded-xl border border-border-light p-6 mb-8">
                    <h4 className="text-lg font-semibold text-primary mb-2">
                        Write a Review
                    </h4>
                    <p className="text-text/60 text-sm mb-4">
                        Share your experience with this property to help others make informed decisions.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-text/70">Your Rating:</span>
                            {renderStars(rating, true)}
                            {rating > 0 && (
                                <span className="text-sm text-text/60">
                                    {rating} {rating === 1 ? 'star' : 'stars'}
                                </span>
                            )}
                        </div>

                        <div className="relative">
                            <textarea
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                placeholder="Share your experience about this property..."
                                rows={4}
                                className="w-full px-4 py-3 bg-background border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none text-text/80 placeholder:text-text/40"
                                required
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-text/30">
                                {newReview.length} / 500
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="submit"
                                disabled={!newReview.trim() || rating === 0 || isPending}
                                className="flex-1 btn btn-primary py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    'Post Review'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setNewReview('')
                                    setRating(0)
                                }}
                                className="flex-1 btn btn-secondary py-3 px-6 rounded-lg font-medium transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            {totalReviews > 0 && (
                <div className="reviews-list space-y-6 mb-8">
                    {reviews.map((review) => {
                        const isHelpful = review.helpful.includes(user?.id);
                        return (
                            <div
                                key={review.id}
                                className="review-item bg-surface p-6 rounded-xl border border-border-light hover:border-primary/20 transition-all duration-200"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                    <div className="flex items-center gap-3">
                                        <FaUserCircle className="w-10 h-10 text-primary/40" />
                                        <div>
                                            <p className="font-medium text-primary">
                                                {review?.user?.name || 'Anonymous User'}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {renderStars(review.stars)}
                                                <span className="text-xs text-text/40">•</span>
                                                <span className="text-xs text-text/60">{formatDate(review.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-primary px-2 py-1 bg-primary/10 rounded-full">
                                        Verified Resident
                                    </span>
                                </div>

                                <p className="text-text/80 leading-relaxed mb-4">
                                    {review.note}
                                </p>

                                <div className="flex items-center gap-4 text-sm">
                                    <button
                                        className={`flex items-center gap-1.5 text-text/60 hover:text-primary transition-colors cursor-pointer ${isHelpful ? "text-black" : ""}`}
                                        onClick={() => handleHelpful(review?.id)}
                                    >
                                        {!isHelpful
                                            ? <BiLike className="w-4 h-4" />
                                            : <AiFillLike className="w-4 h-4" />
                                        }
                                        <span>{review.helpful?.length || 0}</span>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Reviews