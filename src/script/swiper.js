  import Swiper from "swiper";
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/pagination';

    new Swiper(".swiper", {
      modules: [Navigation, Pagination],
      direction: "horizontal",
      loop: true,
      pagination: {
        el: ".swiper-pagination",
      }
    });