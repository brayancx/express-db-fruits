const React = require("react")
const DefaultLayout = require('../layout/Default')

class Index extends React.Component {
  render() {
    const { fruits } = this.props
    return(
        <DefaultLayout 
            title="Fruits Index Page" 
            link="/fruits/new" 
            text="Create a Fruit"
        >
            <ul>
                {fruits.map((fruit, i) => {
                    return (
                        <li key={i}>
                            The {" "}
                            <a href={`/fruits/${fruit._id}`}>
                                {fruit.name}
                            </a>{" "}
                            is {fruit.color} <br></br>
                            {fruit.readyToEat
                                ? `It is ready to eat`
                                : `It is not ready to eat`}
                            <br />
                            {/* Link to this specific fruit's edit page */}
                            <a href={`/fruits/${fruit._id}/edit`}>Edit This Fruit</a>
                            {/* This will be the delete button, it is a form because we need to make a request to our server. Can't use handleClick in server-side app */}
                            <form action={`/fruits/${fruit._id}?_method=DELETE`} method="POST">
                                <input type="submit" value="DELETE" />
                            </form>
                        </li>
                    );
                })}
            </ul>
        </DefaultLayout>
    )
  }
}

module.exports = Index
