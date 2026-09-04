 import type { Testimonial } from "@/types/dataTypes"

 const testimonials: Testimonial[] = [
    {
      "id": 1,
      "quote": "UdeSport delivered exactly what we needed – a technically gifted, mentally prepared player who hit the ground running in the Bundesliga.",
      "author": "Scout Director",
      "club": "Bundesliga Club",
      "country": "Germany",
    },
    {
      "id": 2,
      "quote": "We were impressed by the player's tactical awareness and adaptability to our system. A seamless integration into the squad.",
      "author": "Head Coach",
      "club": "Premier League Club",
      "country": "England",
    },
    {
      "id": 3,
      "quote": "The professionalism and work ethic of the players from UdeSport is exceptional. They bring both skill and character.",
      "author": "Technical Director",
      "club": "Serie A Club",
      "country": "Italy",
    },
    {
      "id": 4,
      "quote": "A game-changer for our midfield. UdeSport provided a player who not only performs but also elevates the team.",
      "author": "Sporting Director",
      "club": "La Liga Club",
      "country": "Spain",
    }
  ]

  // export const fetchAllTestimonials = async (): Promise<Testimonial[]> => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(testimonials)
  //     }, 1000)
  //   })
  // }

  export const fetchAllTestimonials = async (): Promise<Testimonial[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = false;

      if (shouldFail) {
        reject(new Error("Failed to fetch testimonials"));
        return;
      }

      resolve(testimonials);
    }, 1000);
  });
};