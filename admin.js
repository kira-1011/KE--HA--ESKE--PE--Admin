const express = require("express");
const mongoose = require("mongoose");
const Project = require("./models/Project");
const bodyParser = require("body-parser");
const multer = require("multer");

//Configuring multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        console.log(req.body)

        let path = req.body.mainCategory.toLowerCase();

        if(path != "build")
            path +=  "/" + req.body.subCategory.toLowerCase() + "/" + req.body.subSubCategory.toLowerCase();

      cb(null, "./public/images/Uploads/" + path);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
  
const upload = multer({ storage: storage })

const app = express();

const cors = require('cors');

let PORT = process.env.PORT || 4000;

app.use(cors());

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

const dbUrl = "mongodb+srv://Kira:kiraatmongoose@ke-ha-eske-pe.0acsf3c.mongodb.net/KE-HA-ESKE-PE?retryWrites=true&w=majority";

//Connect to Database
mongoose.connect(dbUrl)
.then((result) =>
{
    console.log("Connected to db");
    app.listen(PORT, () => console.log("Server listening on port 4000"));
})
.catch((err) => console.log(err));



//Routes
app.get("/", (req, res) => {
   res.render("index");
});

app.get("/about", (req, res) => {
    res.render("aboutpage");
});

app.get("/build", (req, res) => {
    const data = {
        mainCategory: "build", 
        subCategory: "", 
        subSubCategory: ""};

    Project.find(data).sort({createdAt: -1})
    .then((projects) => {

        if(projects.length > 0)
            res.render("detailpage", {projects, data});
        else
            res.redirect("/project/addProject");
    })
    .catch((err) => res.status(404).render("404"));
});

app.get("/build/:id", (req, res) => {

    const id = req.params.id;

    Project.findById(id)
    .then((project) => {
        res.render("descriptionpage", {project});
    })
    .catch((err) => console.log(err));

});

app.get("/project/addProject", (req, res) => {
    res.render("addProject");
});


app.get("/project/editProject/:id", (req, res) => {

    const id = req.params.id;

    Project.findById(id)
    .then((project) => {
        res.render("editProject", {project, id});
    })
    .catch((err) => {
        res.redirect("/");
    });
});

//CRUD Operations

//Add

app.post("/project/add", upload.array('image') ,(req, res) => {

    req.body.path = [];

    req.files.forEach((images) => {
        req.body.path.push(images.originalname);
    });

    const projectData = req.body;

    projectData.mainCategory =  projectData.mainCategory.toLowerCase();
    projectData.subCategory =  (projectData.subCategory)? projectData.subCategory.toLowerCase()  : "";
    projectData.subSubCategory =  (projectData.subSubCategory)? projectData.subSubCategory.toLowerCase()  : "";

    const project = new Project(projectData);

    project.save()
    .then((result) => {
        console.log("Saved Successfully!");

        let subRoutes = (project.mainCategory != "build")?  "/" + project.subCategory.toLowerCase() + "/" + project.subSubCategory.toLowerCase() : "";

        res.json("/" + req.body.mainCategory.toLowerCase() + subRoutes);
    })
    .catch(err => res.redirect("/project/addProject"));
    
});

//Edit

app.post("/project/edit/:id", upload.array('image') ,(req, res) => {
   
    const id = req.params.id;

    Project.findById(id).then((data) => {
        req.body.path = [];
        for(let i = req.files.length; i < data.path.length; i++){
            req.body.path.push(data.path[i]);
        };

        const projectData = req.body;
        projectData.mainCategory =  projectData.mainCategory.toLowerCase();
        projectData.subCategory =  (projectData.subCategory)? projectData.subCategory.toLowerCase()  : "";
        projectData.subSubCategory =  (projectData.subSubCategory)? projectData.subSubCategory.toLowerCase()  : "";
    
        // const project = new Project(projectData);
        Project.findByIdAndUpdate(id,projectData)
        .then(() =>  {
            console.log("Updated Successfully!");
            console.log(projectData);
            res.redirect("/project/editProject/" + id);
        })
        .catch((err) => {
            console.log(err);
        });
    })
}
);

//Delete

app.delete("/project/delete/:id", (req, res) => {

    const id = req.params.id;
    Project.findByIdAndDelete(id)
    .then((project) => {
        console.log("Deleted Successfully");
        res.json(project);
    })
    .catch((err) => {
        console.log(err);
        res.redirect("/project/edit/:id");
    });
});

//

app.get("/:mainCategory/:subCategory/:subSubCategory", (req, res) => {
    const data = {
        mainCategory: req.params.mainCategory, 
        subCategory: req.params.subCategory, 
        subSubCategory: req.params.subSubCategory};
    
    if(data.subSubCategory == "all")
        delete data.subSubCategory;


    Project.find(data).sort({createdAt: -1})
    .then((projects) => {

        const url = req.url;

        if(projects.length > 0)
            res.render("detailpage", {projects, data, url});
           
        else
            res.redirect("/project/addProject");
    })
    .catch((err) => res.status(404).render("404"));
});

app.get("/:mainCategory/:subCategory/:subSubCategory/:id", (req, res) => {

    const id = req.params.id;

    Project.findById(id)
    .then((project) => {
        res.render("descriptionpage", {project});
    })
    .catch((err) => res.status(404).render("404"));
});

