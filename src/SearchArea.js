// import React from 'react'

// function SearchArea(props) {
//     return (
//         <div className="search__area">
//             <form onSubmit={props.serchPayload}>
//                 <input type="text" onChange={props.handleSearch} />
//                 <button type="submit"> Search</button>
//             </form>

//         </div>
//     )
// }

// export default SearchArea
/* Pagination Component
-------------------------------------------------*/

const propTypes = {
    items: React.PropTypes.array.isRequired,
    onChangePage: React.PropTypes.func.isRequired,
    initialPage: React.PropTypes.number
}

const defaultProps = {
    initialPage: 1
}

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pager: {} };
    }

    componentWillMount() {
        // set page if items array isn't empty
        if (this.props.items && this.props.items.length) {
            this.setPage(this.props.initialPage);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed
        if (this.props.items !== prevProps.items) {
            this.setPage(this.props.initialPage);
        }
    }

    setPage(page) {
        var items = this.props.items;
        var pager = this.state.pager;

        if (page < 1 || page > pager.totalPages) {
            return;
        }

        // get new pager object for specified page
        pager = this.getPager(items.length, page);

        // get new page of items from items array
        var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

        // update state
        this.setState({ pager: pager });

        // call change page function in parent component
        this.props.onChangePage(pageOfItems);
    }

    getPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 10;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    render() {
        var pager = this.state.pager;

        if (!pager.pages || pager.pages.length <= 1) {
            // don't display pager if there is only 1 page
            return null;
        }

        return (
            <ul className="pagination">
                <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(1)}>First</a>
                </li>
                <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.currentPage - 1)}>Previous</a>
                </li>
                {pager.pages.map((page, index) =>
                    <li key={index} className={pager.currentPage === page ? 'active' : ''}>
                        <a onClick={() => this.setPage(page)}>{page}</a>
                    </li>
                )}
                <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.currentPage + 1)}>Next</a>
                </li>
                <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                    <a onClick={() => this.setPage(pager.totalPages)}>Last</a>
                </li>
            </ul>
        );
    }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;


/* App Component
-------------------------------------------------*/

class App extends React.Component {
    constructor() {
        super();

        // an example array of items to be paged
        var exampleItems = [...Array(150).keys()].map(i => ({ id: (i+1), name: 'Item ' + (i+1) }));

        this.state = {
            exampleItems: exampleItems,
            pageOfItems: []
        };

        // bind function in constructor instead of render (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)
        this.onChangePage = this.onChangePage.bind(this);
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="text-center">
                        <h1>React - Pagination Example with logic like Google</h1>
                        {this.state.pageOfItems.map(item =>
                            <div key={item.id}>{item.name}</div>
                        )}
                        <Pagination items={this.state.exampleItems} onChangePage={this.onChangePage} />
                    </div>
                </div>
                <hr />
                <div className="credits text-center">
                    <p>
                        <a href="http://jasonwatmore.com/post/2017/03/14/react-pagination-example-with-logic-like-google" target="_top">React - Pagination Example with Logic like Google</a>
                    </p>
                    <p>
                        <a href="http://jasonwatmore.com" target="_top">JasonWatmore.com</a>
                    </p>
                </div>
            </div>
        );
    }
}

/* Render Call
-------------------------------------------------*/
ReactDOM.render(<App />, document.getElementById('app'));