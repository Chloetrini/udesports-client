"use client"
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react';


interface MediaItemType {
    id: string;
    type: string;
    title: string;
    desc: string;
    url: string;
    span: string;
    // Optional manual override for where a crop should center, as a CSS
    // object-position value (e.g. "50% 15%", "top"). Use this for the rare
    // photo where automatic face-cropping (see Gallery.tsx) gets it wrong —
    // group shots, side profiles, etc. Defaults to a slightly top-biased
    // position rather than dead-center, since portraits usually have their
    // subject's face in the upper half of the frame. Only relevant to the
    // grid thumbnail — the modal shows the full, uncropped image and never
    // applies this.
    focal?: string;
    // Uncropped source, used only for the modal's main image so clicking a
    // photo always shows the whole thing regardless of the face-focused
    // crop used for the grid thumbnail. Falls back to `url` if not given.
    fullUrl?: string;
}

const MediaItem = ({ item, className, onClick }: { item: MediaItemType, className?: string, onClick?: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [isBuffering, setIsBuffering] = useState(true);
    const objectPosition = item.focal ?? '50% 25%';

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setIsInView(entry.isIntersecting);
            });
        }, options);

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let mounted = true;

        const handleVideoPlay = async () => {
            if (!videoRef.current || !isInView || !mounted) return;

            try {
                if (videoRef.current.readyState >= 3) {
                    setIsBuffering(false);
                    await videoRef.current.play();
                } else {
                    setIsBuffering(true);
                    await new Promise((resolve) => {
                        if (videoRef.current) {
                            videoRef.current.oncanplay = resolve;
                        }
                    });
                    if (mounted) {
                        setIsBuffering(false);
                        await videoRef.current.play();
                    }
                }
            } catch (error) {
                console.warn("Video playback failed:", error);
            }
        };

        if (isInView) {
            handleVideoPlay();
        } else if (videoRef.current) {
            videoRef.current.pause();
        }

        return () => {
            mounted = false;
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }
        };
    }, [isInView]);

    if (item.type === 'video') {
        return (
            <div className={`${className} relative overflow-hidden`}>
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    onClick={onClick}
                    playsInline
                    muted
                    loop
                    preload="auto"
                    style={{
                        objectPosition,
                        opacity: isBuffering ? 0.8 : 1,
                        transition: 'opacity 0.2s',
                        transform: 'translateZ(0)',
                        willChange: 'transform',
                    }}
                >
                    <source src={item.url} type="video/mp4" />
                </video>
                {isBuffering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <img
            src={item.url}
            alt={item.title}
            // caller-provided className comes last so an explicit object-fit
            // (e.g. the modal's object-contain) actually wins instead of
            // always being overridden by the object-cover default below —
            // previously the modal's "object-contain" was silently losing
            // to this "object-cover", cropping/zooming photos in the popup
            // instead of showing the whole image.
            className={`object-cover cursor-pointer ${className}`}
            style={{ objectPosition }}
            onClick={onClick}
            loading="lazy"
            decoding="async"
        />
    );
};

interface GalleryModalProps {
    selectedItem: MediaItemType;
    isOpen: boolean;
    onClose: () => void;
    setSelectedItem: (item: MediaItemType | null) => void;
    mediaItems: MediaItemType[];
}
const GalleryModal = ({ selectedItem, isOpen, onClose, setSelectedItem, mediaItems }: GalleryModalProps) => {
    const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });

    if (!isOpen) return null;

    // The modal always shows the full, uncropped photo — never the
    // face-focused crop used for the grid thumbnail — and doesn't need a
    // focal-point override since nothing is being cropped here.
    const modalItem: MediaItemType = {
        ...selectedItem,
        url: selectedItem.fullUrl ?? selectedItem.url,
        focal: undefined,
    };

    return (
        <>
            {/* dimmed backdrop — only really visible now that the modal itself
                is inset on mobile instead of covering the full screen; tapping
                it closes the modal, same as the close button. */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-0"
                onClick={onClose}
            />
            <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.98 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
                className="fixed inset-4 sm:inset-0 sm:w-full sm:min-h-screen sm:h-[90vh] md:h-[600px] bg-white dark:bg-[#0d1117] backdrop-blur-lg
                          rounded-2xl sm:rounded-lg md:rounded-xl overflow-hidden z-50 shadow-2xl"

            >
                <div className="h-full flex flex-col">
                    <div className="flex-1 min-h-0 p-2 sm:p-3 md:p-4 flex items-center justify-center bg-gray-50/50">
                        <AnimatePresence mode="wait">
                            {/* Wrapper shrink-wraps to the image's own rendered
                                size (inline-block, no fixed aspect ratio) instead
                                of forcing every photo into the same 16:9 box.
                                The image itself carries the size caps (see
                                MediaItem className below) so it renders as large
                                as possible within the same bounding limits for
                                every photo — landscape shots max out on width,
                                portraits max out on height — which is what keeps
                                sizing consistent across differently-shaped
                                photos without ever cropping any of them. */}
                            <motion.div
                                key={selectedItem.id}
                                className="relative inline-block max-w-[95%] sm:max-w-[85%] md:max-w-3xl rounded-lg overflow-hidden shadow-md"
                                initial={{ y: 20, scale: 0.97 }}
                                animate={{
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                        mass: 0.5
                                    }
                                }}
                                exit={{
                                    y: 20,
                                    scale: 0.97,
                                    transition: { duration: 0.15 }
                                }}
                                onClick={onClose}
                            >
                                <MediaItem
                                    item={modalItem}
                                    className="block max-w-full max-h-[60vh] sm:max-h-[75vh] md:max-h-[70vh] w-auto h-auto object-contain"
                                    onClick={onClose}
                                />
                                {/* Caption overlay — sm and up only. On mobile the
                                    caption moves out from on top of the photo into
                                    its own block below (see GalleryModal's caption
                                    block further down), since long captions were
                                    covering too much of the image on small screens. */}
                                <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 pb-4 sm:pb-5
                                              bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                                    <h3 className="text-white text-lg sm:text-lg md:text-xl font-semibold">
                                        {selectedItem.title}
                                    </h3>
                                    <p className="text-white/85 text-sm sm:text-sm mt-1">
                                        {selectedItem.desc}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Mobile-only caption, below the image instead of overlaying
                        it. Scrolls independently so a long description can never
                        push the image out or get clipped by the card's
                        overflow-hidden. */}
                    <div className="sm:hidden shrink-0  overflow-y-auto px-4 mb-15 border-t border-gray-200 dark:border-gray-800">
                        <h3 className="text-[#060A0F] dark:text-white text-base font-semibold">
                            {selectedItem.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                            {selectedItem.desc}
                        </p>
                    </div>
                </div>

                <motion.button
                    className="absolute top-2 sm:top-2.5 md:top-3 right-2 sm:right-2.5 md:right-3 
                              p-2 rounded-full bg-gray-200/80 text-gray-700 hover:bg-gray-300/80 
                              text-xs sm:text-sm backdrop-blur-sm "
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X className='w-3 h-3' />
                </motion.button>

            </motion.div>

            <motion.div
                drag
                dragMomentum={false}
                dragElastic={0.1}
                initial={false}
                animate={{ x: dockPosition.x, y: dockPosition.y }}
                onDragEnd={(_, info) => {
                    setDockPosition(prev => ({
                        x: prev.x + info.offset.x,
                        y: prev.y + info.offset.y
                    }));
                }}
                className="fixed z-50 left-1/2 bottom-4 -translate-x-1/2 touch-none"
            >
                <motion.div
                    className="relative rounded-xl bg-sky-400/20 backdrop-blur-xl 
                             border border-blue-400/30 shadow-lg
                             cursor-grab active:cursor-grabbing"
                >
                    <div className="flex items-center -space-x-2 px-3 py-2">
                        {mediaItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(item);
                                }}
                                style={{
                                    zIndex: selectedItem.id === item.id ? 30 : mediaItems.length - index,
                                }}
                                className={`
                                    relative group
                                    w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0 
                                    rounded-lg overflow-hidden 
                                    cursor-pointer hover:z-20
                                    ${selectedItem.id === item.id
                                        ? 'ring-2 ring-white/70 shadow-lg'
                                        : 'hover:ring-2 hover:ring-white/30'}
                                `}
                                initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
                                animate={{
                                    scale: selectedItem.id === item.id ? 1.2 : 1,
                                    rotate: selectedItem.id === item.id ? 0 : index % 2 === 0 ? -15 : 15,
                                    y: selectedItem.id === item.id ? -8 : 0,
                                }}
                                whileHover={{
                                    scale: 1.3,
                                    rotate: 0,
                                    y: -10,
                                    transition: { type: "spring", stiffness: 400, damping: 25 }
                                }}
                            >
                                {/* Dock thumbnails intentionally keep the cropped,
                                    face-focused `item` (not modalItem) — they're
                                    small navigation icons, not the "see the whole
                                    photo" surface. */}
                                <MediaItem item={item} className="w-full h-full" onClick={() => setSelectedItem(item)} />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20" />
                                {selectedItem.id === item.id && (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className="absolute -inset-2 bg-white/20 blur-xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

interface InteractiveBentoGalleryProps {
    mediaItems: MediaItemType[]
    title?: string
    description?: string
}

const InteractiveBentoGallery: React.FC<InteractiveBentoGalleryProps> = ({ mediaItems, title, description }) => {
    const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
    const [items, setItems] = useState(mediaItems);
    const [isDragging, setIsDragging] = useState(false);

    // Prevent the page behind the modal from scrolling while an item is open
    useEffect(() => {
        if (!selectedItem) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [selectedItem]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {(title || description) && (
                <div className="mb-8 text-center">
                    {title && (
                        <motion.h1
                            className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent 
                                     bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
                                     dark:from-white dark:via-gray-200 dark:to-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {title}
                        </motion.h1>
                    )}
                    {description && (
                        <motion.p
                            className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 "
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {description}
                        </motion.p>
                    )}
                </div>
            )}
            <AnimatePresence mode="wait">
                {selectedItem ? (
                    <GalleryModal
                        selectedItem={selectedItem}
                        isOpen={true}
                        onClose={() => setSelectedItem(null)}
                        setSelectedItem={setSelectedItem}
                        mediaItems={items}
                    />
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[200px] sm:auto-rows-[75px] md:auto-rows-[80px]"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                    >
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layoutId={`media-${item.id}`}
                                className={`relative overflow-hidden rounded-xl cursor-move ${item.span}`}
                                onClick={() => !isDragging && setSelectedItem(item)}
                                variants={{
                                    hidden: { y: 50, scale: 0.9, opacity: 0 },
                                    visible: {
                                        y: 0,
                                        scale: 1,
                                        opacity: 1,
                                        transition: {
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 25,
                                            delay: index * 0.05
                                        }
                                    }
                                }}
                                whileHover={{ scale: 1.02 }}
                                drag
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                dragElastic={1}
                                onDragStart={() => setIsDragging(true)}
                                onDragEnd={(_e, info) => {
                                    setIsDragging(false);
                                    const moveDistance = info.offset.x + info.offset.y;
                                    if (Math.abs(moveDistance) > 50) {
                                        const newItems = [...items];
                                        const draggedItem = newItems[index];
                                        const targetIndex = moveDistance > 0 ?
                                            Math.min(index + 1, items.length - 1) :
                                            Math.max(index - 1, 0);
                                        newItems.splice(index, 1);
                                        newItems.splice(targetIndex, 0, draggedItem);
                                        setItems(newItems);
                                    }
                                }}
                            >
                                <MediaItem
                                    item={item}
                                    className="absolute inset-0 w-full h-full"
                                    onClick={() => !isDragging && setSelectedItem(item)}
                                />
                                <motion.div
                                    className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3 md:p-4"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-3 md:p-4">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        <h3 className="relative text-white text-xs sm:text-sm md:text-base font-medium line-clamp-1">
                                            {item.title}
                                        </h3>
                                        <p className="relative text-white/70 text-[10px] sm:text-xs md:text-sm mt-0.5 line-clamp-2">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InteractiveBentoGallery