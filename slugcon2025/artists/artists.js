// temporary variables
// one piece of work from each artist should display first
// to even out people who submitted 1 work vs people who submitted 10
let artistFirst = [];
let others = [];

// list of artworks to put in each panel
let panel1 = [];
let panel2 = [];
let panel3 = [];

const imageFormat = "avif";

function start() {
	Object.keys(artistInfo).forEach((artist) => {
		if (artistInfo[artist].artworkCount < 1) {
			return;
		}
		const artworks = generateArray(artist, artistInfo[artist].artworkCount);

		// select a random artwork to be their main one
		const rand = Math.floor(Math.random() * artworks.length);
		artistFirst.push(artworks[rand]);

		// add rest to other list of artworks
		artworks.splice(rand, 1);
		others = [...others, ...artworks];
	});

	// organize artowrks into the 3 panels
	shuffleArray(artistFirst);
	let split = artistFirst.length / 3;
	panel1 = artistFirst.splice(0, Math.floor(split));
	panel2 = artistFirst.splice(0, Math.floor(split));
	panel3 = artistFirst;

	shuffleArray(others);
	split = others.length / 3;
	panel3 = [...panel3, ...others.splice(0, Math.floor(split))];
	panel2 = [...panel2, ...others.splice(0, Math.floor(split))];
	panel1 = [...panel1, ...others];

	// create HTML elements and add to page
	createArtworkElement(panel1, "panel1");
	createArtworkElement(panel2, "panel2");
	createArtworkElement(panel3, "panel3");

	// add event listeners to all artworks
	document.querySelectorAll(".gallery-artwork").forEach((artwork) => {
		artwork.addEventListener("click", function () {
			const artist = this.dataset.artist;
			openDetailedView(artist);
		});
	});
}

document.addEventListener("DOMContentLoaded", function () {
	start(); // magic
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// generates array of artist artwork filenames
function generateArray(artistID, artworkCount) {
	return [...Array(artworkCount).keys()].map((i) => {
		return `artistWorks/${artistID}_${i.toString().padStart(2, "0")}.${
			["erikaStewart", "appleSketch"].includes(artistID) && i == 0
				? "gif"
				: imageFormat
		}`;
	});
}

// array shuffler using Fisher-Yates
function shuffleArray(arr) {
	for (let i = arr.length - 1; i > 0; --i) {
		let j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

// unification of artwork HTML element creation
function createArtworkElement(arr, panelID) {
	arr.forEach((artwork) => {
		const img = document.createElement("img");
		img.className = "gallery-artwork";
		img.src = `./${artwork}`;
		img.alt = artwork.split("/")[1];
		img.dataset.artist = artwork.split("/")[1].split("_")[0];
		document.getElementById(panelID).appendChild(img);
	});
}

// onclick for each artwork, shows more detail about work
function openDetailedView(artist) {
	document.getElementById("artist-info").classList.remove("hidden");

	document.querySelector("#artist-info .name").innerText =
		artistInfo[artist].name;
	document.querySelector("#artist-info .bio").innerText =
		artistInfo[artist].bio;
	document.querySelector("#artist-info .pfp").src =
		`./artistPfps/${artist}.${imageFormat}`;
	document.querySelector("#artist-info .pfp").alt =	"no pfp :(";

	// clean old divs
	const p1 = document.querySelector("#artist-info .artworks .panel1");
	const p2 = document.querySelector("#artist-info .artworks .panel2");
	while (p1.firstChild) {
		p1.removeChild(p1.firstChild);
	}
	while (p2.firstChild) {
		p2.removeChild(p2.firstChild);
	}
	const socials = document.querySelector("#artist-info .socials");
	while (socials.firstChild) {
		socials.removeChild(socials.firstChild);
	}

	// insert all artist artworks
	const artworks = generateArray(artist, artistInfo[artist].artworkCount);
	artworks.forEach((artwork, i) => {
		const img = document.createElement("img");
		img.src = `./${artwork}`;
		if (i % 2 === 0) {
			p1.appendChild(img);
		} else {
			p2.appendChild(img);
		}
	});

	//insert socials
	Object.keys(artistInfo[artist].socials).forEach((social) => {
		const a = document.createElement("a");
		a.href = artistInfo[artist].socials[social];
		a.target = "_blank";
		const icon = document.createElement("img");
		icon.src = `./socials/${social}.${imageFormat}`;
		a.appendChild(icon);
		socials.appendChild(a);
	});

	// reset scroll position
	document.querySelector("#artist-info > div").scrollTop = 0;
}

// closing overlay
function closeDetailedView() {
	document.getElementById("artist-info").classList.add("hidden");
}
