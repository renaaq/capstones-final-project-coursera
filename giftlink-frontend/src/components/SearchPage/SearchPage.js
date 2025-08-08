import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../../config.js'

function SearchPage() {

    // Task 1: Define state variables for the search query, age range, and search results.
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();

    // Load all products initially
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = `${config.baseUrl}/api/gifts`;
                console.log("Fetching all gifts from: ", url);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error; ${response.status}`);
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);

    // Task 2: Fetch search results based on filters
    const handleSearch = async () => {
        const baseUrl = `${config.baseUrl}/api/search?`;
        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: document.getElementById('categorySelect').value,
            condition: document.getElementById('conditionSelect').value,
        }).toString();

        try {
            const response = await fetch(`${baseUrl}${queryParams}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
            setSearchResults([]);
        }
    };

    // Task 6: Navigate to details page of selected gift
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">

                    {/* Filters Section */}
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">

                            {/* Task 3: Category dropdown */}
                            <label htmlFor="categorySelect">Category</label>
                            <select id="categorySelect" className="form-control my-1">
                                <option value="">All</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {/* Task 3: Condition dropdown */}
                            <label htmlFor="conditionSelect">Condition</label>
                            <select id="conditionSelect" className="form-control my-1">
                                <option value="">All</option>
                                {conditions.map(cond => (
                                    <option key={cond} value={cond}>{cond}</option>
                                ))}
                            </select>

                            {/* Task 4: Age range slider */}
                            <label htmlFor="ageRange">Less than {ageRange} years</label>
                            <input
                                type="range"
                                className="form-control-range"
                                id="ageRange"
                                min="1"
                                max="10"
                                value={ageRange}
                                onChange={e => setAgeRange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Task 7: Search input */}
                    <input
                        type="text"
                        placeholder="Search by name"
                        className="form-control mb-3"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />

                    {/* Task 8: Search button */}
                    <button className="btn btn-primary mb-3" onClick={handleSearch}>
                        Search
                    </button>

                    {/* Task 5: Display search results */}
                    <div className="search-results mt-4">
                        {searchResults.length > 0 ? (
                            searchResults.map(product => (
                                <div key={product.id} className="card mb-3">
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="card-img-top"
                                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.description?.slice(0, 100)}...</p>
                                    </div>
                                    <div className="card-footer">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => goToDetailsPage(product.id)}
                                        >
                                            View More
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-info" role="alert">
                                No products found. Please revise your filters.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SearchPage;
