var params = new URLSearchParams(window.location.search);

document.getElementById("trainingName").innerHTML = params.get("training") || "Training";
document.getElementById("trainingMeta").innerHTML =
  "Requested by " + params.get("user") + " · approx. " + params.get("minutes") + " min";

function startTraining() {
  window.location.href = "/api/launch?training=" + params.get("training");
}
