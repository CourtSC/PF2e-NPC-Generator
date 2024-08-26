import os
import json
import unicodedata

if __name__ == "__main__":
    apiResults = os.listdir(".\\data")
    nameDict = {"male": []}

    for result in apiResults:
        with open(f".\\data\\{result}", "r") as resultData:
            resultJSON = json.load(resultData)
        for name in resultJSON["query"]["categorymembers"]:
            nameDict["male"].append(
                unicodedata.normalize("NFKD", name["title"])
                .encode("ascii", "ignore")
                .decode("ascii")
            )

    nameDict["male"].sort()
    print(nameDict["male"])

    with open(".\\givenNames.json", "w") as nameFile:
        nameFile.write(f"{nameDict}")
