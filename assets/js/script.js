const lookupButton = document.getElementById("lookupBtn");
const inputDiv = document.getElementById("pincode-input");
const detailsDiv = document.getElementById("pincode-details");
const detailsRow = document.getElementById("details-row");
const preloader = document.getElementById('preloader');
let postOfficedata = [];
const generateDetails = (data) => {
    let html = '<div class="row">';
    if (data.length === 0) {
        return '<p>Couldn’t find the postal data you’re looking for<p>';
    }
    data.forEach((item) => {
        html += `<div class="col">
                    <div class="details-box">
                        <p>Name: ${item.Name}</p>
                        <p>Branch Type: ${item.BranchType}</p>
                        <p>Delivery Status: ${item.DeliveryStatus}</p>
                        <p>District: ${item.District}</p>
                        <p>Division: ${item.Division}</p>
                    </div>
                </div>`
    });
    html += "</div>"
    return html;
}
const handleLookup = async () => {
    const pincodeInput = document.getElementById("pincode").value;
    if (pincodeInput.length < 6 || !pincodeInput.trim()) {
        alert("The code is not 6 digits");
        return;
    }
    try {
        preloader.style.display = "flex";
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincodeInput}`);
        const data = await res.json();
        if (!data[0].PostOffice || data[0].PostOffice.length === 0) {
            alert("Couldn’t find the postal data you’re looking for");
            preloader.style.display = "none";
            return;
        }
        postOfficedata = [...data[0].PostOffice];
        inputDiv.style.display = "none";
        document.getElementById("pincode-content").textContent = pincodeInput;
        document.getElementById("message-content").textContent = data[0].Message;
        const newHtml = generateDetails(data[0].PostOffice);
        detailsRow.innerHTML = newHtml;
        detailsDiv.style.display = "block";
        preloader.style.display = "none";
    } catch (error) {
        alert(error);
    }
}
lookupButton.addEventListener("click", handleLookup);
const filterInput = document.getElementById("filter");
const handleFilter = (event) => {
    const query = event.target.value;
    if (query.length > 1) {
        const filteredData = postOfficedata.filter(item => item.Name.toLowerCase().includes(query.toLowerCase()));
        const newHtml = generateDetails(filteredData);
        detailsRow.innerHTML = newHtml;
    } else {
        const newHtml = generateDetails(postOfficedata);
        detailsRow.innerHTML = newHtml;
    }
}
filterInput.addEventListener("keyup", handleFilter);
document.addEventListener('DOMContentLoaded', () => {
    detailsDiv.style.display = "none";
})