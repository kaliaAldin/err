export function formatDate(iso){
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

export function randomOffset(maxDelta){
  return (Math.random() - 0.5) * maxDelta;
}

export function createDropdown(options, parentElement, id){
  const dropdown = document.createElement("select");
  dropdown.id = id;

  options.forEach((option, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = String(index);
    optionElement.textContent = option.name;
    dropdown.appendChild(optionElement);
  });

  parentElement.appendChild(dropdown);
  return dropdown;
}

export function removeDropdown(dropdown, parentElement){
  if (dropdown) {
    parentElement.removeChild(dropdown);
    return null;
  }
  return null;
}
