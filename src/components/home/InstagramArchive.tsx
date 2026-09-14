import instagramIcon from '@/assets/icons_insta.png';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import AutoScroll from 'embla-carousel-auto-scroll';
import { useGetGalleryImages } from '@/hooks/useApi';
import PageWrapper from '../page-wrapper';

// "The Archives" — a scrolling carousel of the same photos managed in the
// admin Gallery, each linking out to the original Instagram post. Only
// shows up once there's at least one published gallery item with a photo.
const InstagramArchive = () => {
  const { data: photos, isLoading } = useGetGalleryImages();

  const withPhotos = (photos ?? []).filter((p) => !!p.coverImage);

  if (!isLoading && withPhotos.length === 0) return null;

  return (
    <div className="my-14">
      <PageWrapper className="p-[20px]">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-[#00D46A4D] flex items-center gap-2 rounded-full px-4 py-2 w-fit">
            <img src={instagramIcon} alt="" className="w-3.5 h-3.5 object-contain" />
            <span className="font-manrope font-bold text-[13px] text-[#00A553]">Instagram</span>
          </span>
        </div>
        <h2 className="font-bebas text-[clamp(40px,6vw,64px)] leading-[1.05] text-[#060A0F] dark:text-white mb-8">
          THE ARCHIVES
        </h2>
      </PageWrapper>

      <div className="w-full lg:mr-[calc((100vw-100%)/-2)]">
        {isLoading ? (
          <div className="flex gap-4 pl-[20px] lg:pl-[calc((100vw-1280px)/2+20px)] overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-[280px] h-[380px] rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse shrink-0" />
            ))}
          </div>
        ) : (
          <Carousel
            opts={{ align: 'start', loop: true }}
            plugins={[
              AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true }),
            ]}
            className="w-full"
          >
            <CarouselContent className="ml-0 pl-[20px] lg:pl-[calc((100vw-1280px)/2+20px)] gap-4">
              {withPhotos.map((photo) => (
                <CarouselItem key={photo.id} className="basis-auto pl-0">
                  <a
                    href={photo.instaUrl || undefined}
                    target={photo.instaUrl ? "_blank" : undefined}
                    rel={photo.instaUrl ? "noreferrer" : undefined}
                    className={`block w-[280px] h-[380px] rounded-2xl overflow-hidden relative group ${photo.instaUrl ? "cursor-pointer" : "cursor-default"} transition-transform duration-300 hover:scale-[0.98]`}
                  >
                    <img
                      src={photo.coverImage ?? ""}
                      alt={photo.headline ?? ""}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00A553] via-[#00A553]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="font-manrope font-bold text-white text-[15px] leading-tight mb-1">
                        {photo.headline || "UDESport"}
                      </p>
                      {photo.description && (
                        <p className="font-manrope text-white/85 text-[12px] leading-snug line-clamp-2">
                          {photo.description}
                        </p>
                      )}
                    </div>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default InstagramArchive;
