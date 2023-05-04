const React = require("react")
const DefaultLayout = require("../layout/Default")

class Show extends React.Component {
  render() {
    const fruit = this.props.fruit
    return (
      <DefaultLayout 
        title="Show Page"
        link="/fruits"
        text="Home"
      >
          The {fruit.name} is {fruit.color} <br />
          {fruit.readyToEat? 'Its is ready to eat' : 'It is not ready to eat... Cant touch this' }
      </DefaultLayout>
    )
  }
}

module.exports = Show