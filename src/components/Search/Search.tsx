import { FormEvent } from "react";
import "./Search.scss";

const onSearchSubmit = (e: FormEvent) => {
  e.preventDefault();
  const data = new FormData(e.target as HTMLFormElement);
  const str = data.get("search_input") as string;
  const container = document.querySelector('div[class="Container"]');
  if (str && container) {
    document.querySelectorAll('ul[class*="hidden"]').forEach((ul) => {
      ul.classList.remove("hidden");
    });
    const bottom = container.getBoundingClientRect().bottom;
    const htmlBoxes = document.querySelectorAll('div[class^="ListItemBox"]');
    const boxes = Array.from(htmlBoxes).filter((box) => {
      const idx = box
        .querySelector('div[class="Text"]')
        ?.textContent?.toLocaleLowerCase()
        .indexOf(str.toLowerCase());
      return idx ? idx > -1 : idx;
    });
    if (boxes.length) {
      const nextBoxes = boxes.filter((box) => {
        return box.getBoundingClientRect().top > bottom;
      });
      const item = nextBoxes.length ? nextBoxes[0] : boxes[0];
      if (item) {
        item.scrollIntoView({ behavior: "smooth" });
      }
    }
  }
};

const Search = () => {
  return (
    <form className="Search" onSubmit={onSearchSubmit}>
      <label htmlFor={"search_input"}>Search:</label>
      <input id={"search_input"} name={"search_input"} type={"search"}></input>
      <button type={"submit"}>Go</button>
    </form>
  );
};

export default Search;
