export const loadJson = (url) => fetch(url).then((response) => response.json())
export const loadSvg = (svg) => fetch(`${svg}`).then((response) => {
    console.log(response)
    if (!response.ok) {
      throw new Error(`Failed to load SVG: ${response.status}`);
    }
    return response.text();
  });
