const React = require("react")
const DefaultLayout = require("../layout/Default")

class Edit extends React.Component {
  render() {
    //grabbing the fruit givin to this page by the edit route on the server.
    const fruit = this.props.fruit
    return (
      <DefaultLayout
        title="Edit Page"
        // 2 properties below are for the Nav component
        link="/fruits"
        text="Home"
      >
        <form action={`/fruits/${fruit._id}?_method=PUT`} method="POST" >
        {/* use the fruit info to give the inputs a defaultValue for a nice user experience */}
        Name: <input type="text" name="name" defaultValue={fruit.name} />
          Color: <input type="text" name="color" defaultValue={fruit.color} />
          Is Ready To Eat: 
          {/* conditionally rendering the checkbox input to make it check by default or not. */}
          { 
            fruit.readyToEat? 
              <input type="checkbox" name="readyToEat" defaultChecked />
            : 
              <input type="checkbox" name="readyToEat"/> 
          }
          <input type="submit" value="Submit Changes" />      
        </form>
      </DefaultLayout>
    )
  }
}

module.exports = Edit