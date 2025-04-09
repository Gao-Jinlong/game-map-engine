import { Map } from "@core";
main();

async function main() {
  const map = new Map({
    container: document.getElementById("map") as HTMLElement,
  });
  console.log("🚀 ~ main ~ map:", map);
}
