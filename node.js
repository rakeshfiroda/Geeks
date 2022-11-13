const Cloudant = require("@cloudant/cloudant");

async function cloudant() {
    const cloudant = Cloudant({
        url: "https://apikey-v2-1yklywskjv1b14xa2udcojdgm21dycs6bxe2wxq2okex:4dfde4719e4842a830a3bafb1473f56b@19647b00-61b4-41d6-a6f9-cad56cdea1b4-bluemix.cloudantnosqldb.appdomain.cloud",
        plugins: {
            iamAuth: {
                iamApiKey: "RLK2hBTYAVyoqfrf1VYbhicaki_x6-DdWcIUcsGCYKW9"
            }
        }
    });

    const db = cloudant.db.use("courses");
    // let a = db.list({include_docs: false});
    // console.log(a);

    // let obj = [
    //     {
    //         id: "Graphql",
    //         name: "Graphql: ultimate begginers guide to learn",
    //         author: "Vartika Sinha",
    //         image: "images/Graphql.jpeg",
    //     },
    //     {
    //         id: "Angular",
    //         name: "Angular: the complete guide for beginner",
    //         author: "Ravi Kumar",
    //         image: "images/angular.jpeg",
    //     },
    //     {
    //         id: "React",
    //         name: "React: Create a website with react",
    //         author: "Ramanjit Singh",
    //         image: "images/react.jpeg",
    //     },
    // ]; 

    // let res = await db.bulk({docs:obj});
    // console.log(res);

    // let res = await db.get("React");
    // console.log(res);

    let res = await db.list({include_docs: true});
    console.log(res);
}

cloudant();

