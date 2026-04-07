

export function extractOptions(data:any) {
    let obj = data.attributes;
    let optionsarray = [];
    for (let key in obj) {
        if (key.includes("option_")) {
            optionsarray.push(obj[key]);
        }
    }

    return optionsarray;
}