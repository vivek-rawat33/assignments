import React from "react";

function App() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "30px",
      }}
    >
      <BusinessCardComponent
        name={"vivek"}
        description={"Web developer (MERN stack)"}
        buttonHandler={["Linkdin", "github"]}
        interaction={"web dev mern stack"}
      />

      <BusinessCardComponent
        name={"vivek"}
        description={"Web developer (MERN stack)"}
        buttonHandler={["Linkdin", "github"]}
        interaction={"web dev mern stack"}
      />
      <BusinessCardComponent
        name={"vivek"}
        description={"Web developer (MERN stack)"}
        buttonHandler={["Linkdin", "github"]}
        interaction={"web dev mern stack"}
      />
      <BusinessCardComponent
        name={"vivek"}
        description={"Web developer (MERN stack)"}
        buttonHandler={["Linkdin", "github"]}
        interaction={"web dev mern stack"}
      />
      <BusinessCardComponent
        name={"vivek"}
        description={"Web developer (MERN stack)"}
        buttonHandler={["Linkdin", "github"]}
        interaction={"web dev mern stack"}
      />
      <BusinessCardComponent
        name={"vivek"}
        description={"Web developer (MERN stack)"}
        buttonHandler={["Linkdin", "github"]}
        interaction={"web dev mern stack"}
      />
      <BusinessCardComponent
        name={"vivek"}
        description={"Web developer (MERN stack)"}
        buttonHandler={["Linkdin", "github"]}
        interaction={"web dev mern stack"}
      />
    </div>
  );
}

function BusinessCardComponent({
  name,
  description,
  buttonHandler,
  interaction,
}) {
  return (
    <>
      <div
        style={{
          border: "2px solid lightblue",
          borderRadius: "20px",
          padding: "10px",
          height: "auto",
          width: "200px",
          margin: "8px",
        }}
      >
        <div>
          <b>{name}</b>
          <br />
          <p>{description}</p>
          <br />
          <b>interaction</b>
          <p>{interaction}</p>
          {buttonHandler.map((value) => {
            return (
              <button
                style={{
                  backgroundColor: "lightblue",
                  border: "none",
                  borderRadius: "10px",
                  padding: "8px",
                  margin: "3px",
                }}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
export default App;
