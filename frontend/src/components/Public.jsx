import { Link } from "react-router-dom";

const Public = () => {
	const content = (
		<section className="public">
			<header>
				<h1>
					Welcome to <span className="nowrap">our repair shop!</span>
				</h1>
			</header>
			<main className="public__main">
				<p>
					Located in Beautiful Varanasi City, Our shop provides a
					trained staff ready to meet your tech repair needs.
				</p>
				<address className="public__addr">
					K.K. Repairs
					<br />
					555 Foo Drive
					<br />
					Varanasi City, CA 12345
					<br />
					<a href="tel:+15555555555">(555) 555-5555</a>
				</address>
				<br />
				<p>Owner: K.K. Singh</p>
			<div style={{"margin-top": "300px"}}>
			{`Admin account: username: saurabh password: 1234
				Employee account: username: john password: 1234`}</div>
			</main>
			<footer>
				<Link to="/login">Employee Login</Link>
			</footer>
		</section>
	);
	return content;
};
export default Public;
