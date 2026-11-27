// 1. Podaci o vozilima: lako dodaš novi auto samo dodavanjem reda
const cars = [
  { name: "Dacia Sandero",   cat: "Ekonomik",  price: 25, seats: 5, gear: "Manuelni",   fuel: "Benzin", img: "images/sandero.webp", color: "#8fa0bb" },
  { name: "Škoda Fabia",     cat: "Ekonomik",  price: 28, seats: 5, gear: "Manuelni",   fuel: "Benzin", img: "images/fabia.webp", color: "#e8483c" },
  { name: "VW Golf 8",       cat: "Porodični", price: 38, seats: 5, gear: "Automatik",  fuel: "Dizel",  img: "images/golf.webp", color: "#3f84d6" },
  { name: "Škoda Octavia",   cat: "Porodični", price: 45, seats: 5, gear: "Automatik",  fuel: "Dizel",  img: "images/octavia.webp", color: "#6d7d96" },
  { name: "Dacia Duster",    cat: "SUV",       price: 48, seats: 5, gear: "Manuelni",   fuel: "Dizel",  img: "images/duster.webp", color: "#c0914a" },
  { name: "Toyota RAV4",     cat: "SUV",       price: 65, seats: 5, gear: "Automatik",  fuel: "Hibrid", img: "images/rav4.webp", color: "#2fae8a" },
  { name: "BMW serija 3",    cat: "Premium",   price: 85, seats: 5, gear: "Automatik",  fuel: "Dizel",  img: "images/bmw3.webp", color: "#566580" },
  { name: "Mercedes C klasa",cat: "Premium",   price: 95, seats: 5, gear: "Automatik",  fuel: "Dizel",  img: "images/mercedes-c.webp", color: "#c3cad6" }
];

const fleet = document.getElementById("fleet");
const select = document.getElementById("carSelect");
const startEl = document.getElementById("start");
const endEl = document.getElementById("end");
const totalEl = document.getElementById("total");
const msg = document.getElementById("msg");

// 2. Crtanje kartica (po izabranoj kategoriji)
function renderFleet(cat) {
  const list = cat === "Svi" ? cars : cars.filter(c => c.cat === cat);
  fleet.innerHTML = list.map(c => `
    <article class="car">
      <div class="car-img${c.img ? ' has-photo' : ''}">${c.img ? `<img src="${c.img}" alt="${c.name}" loading="lazy">` : `<svg style="color:${c.color}" role="img" aria-label="${c.name}"><use href="#car"/></svg>`}</div>
      <div class="car-body">
        <h3>${c.name}</h3>
        <span class="cat">${c.cat}</span>
        <div class="specs"><span>${c.seats} mesta</span><span>${c.gear}</span><span>${c.fuel}</span></div>
        <div class="car-foot">
          <span class="price">${c.price} €<small> / dan</small></span>
          <button class="btn" data-car="${c.name}">Rezerviši</button>
        </div>
      </div>
    </article>`).join("");
}

// 3. Filter dugmad
document.getElementById("filters").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  renderFleet(chip.dataset.cat);
});

// 4. Dugme "Rezerviši" na kartici bira auto u formi i skroluje do nje
fleet.addEventListener("click", e => {
  const btn = e.target.closest("[data-car]");
  if (!btn) return;
  select.value = btn.dataset.car;
  updateTotal();
  document.getElementById("rezervacija").scrollIntoView({ behavior: "smooth" });
});

// 5. Forma: padajuća lista vozila i minimalni datum (danas)
select.innerHTML = cars.map(c => `<option>${c.name}</option>`).join("");
const today = new Date().toISOString().split("T")[0];
startEl.min = endEl.min = today;

// 6. Računanje cene: broj dana x cena po danu
function updateTotal() {
  const car = cars.find(c => c.name === select.value);
  const start = new Date(startEl.value);
  const end = new Date(endEl.value);
  if (!car || !startEl.value || !endEl.value || end <= start) { totalEl.textContent = "–"; return null; }
  const days = Math.ceil((end - start) / 86400000);
  totalEl.textContent = `${days * car.price} € (${days} ${days === 1 ? "dan" : "dana"})`;
  return days;
}
[select, startEl, endEl].forEach(el => el.addEventListener("change", updateTotal));
startEl.addEventListener("change", () => { endEl.min = startEl.value || today; });

// 7. Slanje forme (demo: nema pravog servera, samo provera i poruka)
document.getElementById("booking").addEventListener("submit", e => {
  e.preventDefault();
  msg.className = "msg";
  const fields = ["start", "end", "name", "phone"].map(id => document.getElementById(id));
  fields.forEach(f => f.classList.toggle("bad", !f.value.trim()));
  if (fields.some(f => !f.value.trim())) { msg.textContent = "Popunite sva polja."; return; }
  if (!updateTotal()) { startEl.classList.add("bad"); endEl.classList.add("bad"); msg.textContent = "Datum povratka mora biti posle preuzimanja."; return; }
  msg.className = "msg ok";
  msg.textContent = `Hvala, ${fields[2].value.trim()}! Javićemo vam se na ${fields[3].value.trim()} radi potvrde.`;
  e.target.reset();
  totalEl.textContent = "–";
});

renderFleet("Svi");

// 8. IZBORNIK TEMA. Služi samo da uporediš teme. Kad izabereš, obriši ovaj deo,
//    obriši .theme-box iz style.css i u index.html ostavi samo jedan <link> za temu.
const themes = { "Sportska": "sport", "Korporativna": "plava", "Minimalistička": "minimalna", "Premium": "premium" };
const themeLink = document.getElementById("theme");
const box = document.createElement("label");
box.className = "theme-box";
box.innerHTML = "Tema <select>" + Object.keys(themes).map(n => `<option value="${themes[n]}">${n}</option>`).join("") + "</select>";
document.body.appendChild(box);
const picker = box.querySelector("select");
function setTheme(file) { themeLink.href = `themes/${file}.css`; picker.value = file; try { localStorage.setItem("theme", file); } catch (e) {} }
picker.addEventListener("change", () => setTheme(picker.value));
try { const saved = localStorage.getItem("theme"); if (saved) setTheme(saved); } catch (e) {}
