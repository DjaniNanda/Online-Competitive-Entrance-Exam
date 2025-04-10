import React, { useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import AuthContext from '../context/AuthContext';
import { ApiContext } from '../context/ApiContext';

function Ranking() {
    const [rankings, setRankings] = useState([]);
    const [filteredRankings, setFilteredRankings] = useState([]);
    const [selectedUserResults, setSelectedUserResults] = useState([]);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const { authTokens } = useContext(AuthContext);
    const apiClient = useContext(ApiContext);

    // Filter states (only used by admin)
    const [usernameFilter, setUsernameFilter] = useState('');
    const [minScoreFilter, setMinScoreFilter] = useState('');
    const [maxScoreFilter, setMaxScoreFilter] = useState('');

    useEffect(() => {
        let userGroups = [];
        if (authTokens) {
            const decoded = jwtDecode(authTokens.access);
            userGroups = decoded.groups;
        }
        const adminStatus = userGroups.includes("admin");
        setIsAdmin(adminStatus);

        async function getOverallRankings() {
            try {
                const response = await apiClient.get("/overall-ranking/");
                setRankings(response.data);
                setFilteredRankings(response.data);
            } catch (err) {
                console.error("Error fetching rankings:", err);
                setError("Failed to fetch rankings.");
            }
        }

        getOverallRankings();
    }, [authTokens, apiClient]);

    useEffect(() => {
        if (isAdmin) {
            const filtered = rankings.filter(ranking => {
                const usernameMatch = ranking["user__username"].toLowerCase().includes(usernameFilter.toLowerCase());
                const scoreMatch = (minScoreFilter === '' || ranking.total_score >= Number(minScoreFilter)) &&
                                   (maxScoreFilter === '' || ranking.total_score <= Number(maxScoreFilter));
                return usernameMatch && scoreMatch;
            });
            setFilteredRankings(filtered);
        } else {
            setFilteredRankings(rankings);
        }
    }, [rankings, usernameFilter, minScoreFilter, maxScoreFilter, isAdmin]);

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("dragIndex", index);
    };

    const handleDrop = (e, dropIndex) => {
        const dragIndex = e.dataTransfer.getData("dragIndex");
        const updatedRankings = [...filteredRankings];
        const [movedItem] = updatedRankings.splice(dragIndex, 1);
        updatedRankings.splice(dropIndex, 0, movedItem);
        setFilteredRankings(updatedRankings);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleViewMore = async (userId) => {
        try {
            const response = await apiClient.get(`/candidate-results/${userId}/`);
            setSelectedUserResults(response.data);
            setShowResults(true);
        } catch (err) {
            console.error("Error fetching user results:", err);
            setError("Failed to fetch user results.");
        }
    };

    const handleCloseResults = () => {
        setShowResults(false);
        setSelectedUserResults([]);
    };

    const handlePublishResults = () => {
        const content = filteredRankings.map(ranking => 
            `${ranking["user__username"]},${ranking.total_score}`
        ).join('\n');
        
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rankings.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Inline styles
    const styles = {
        container: {
            textAlign: 'center',
            marginTop: '116px',
            backgroundColor: "#C3B091",
            padding: '20px',
            paddingBottom: '400px',
            borderRadius: '10px',
        },
        errorMessage: {
            color: 'red',
            marginBottom: '20px',
        },
        filterContainer: {
            marginBottom: '20px',
        },
        filterInput: {
            margin: '0 10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
        },
        table: {
            border: '2px solid black',
            borderCollapse: 'collapse',
            width: '800px',
            margin: '20px auto',
        },
        td: {
            border: '1px solid black',
            textAlign: 'center',
            padding: '10px',
        },
        viewButton: {
            padding: '5px 10px',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '5px',
        },
        publishButton: {
            padding: '10px 20px',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: '#008CBA',
            color: 'white',
            borderRadius: '5px',
            fontSize: '16px',
            marginTop: '20px',
        },
        resultsContainer: {
            marginTop: '40px',
        },
        closeButton: {
            marginBottom: '10px',
            padding: '5px 10px',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: '#f44336',
            color: 'white',
            borderRadius: '5px',
        },
    };

    
    return (
        <div style={styles.container}>
            <h2>Overall Rankings</h2>
            {error && <div style={styles.errorMessage}>{error}</div>}
            
            {/* Filter inputs - only shown to admin */}
            {isAdmin && (
                <div style={styles.filterContainer}>
                    <input
                        type="text"
                        placeholder="Filter by username"
                        value={usernameFilter}
                        onChange={(e) => setUsernameFilter(e.target.value)}
                        style={styles.filterInput}
                    />
                    <input
                        type="number"
                        placeholder="Min score"
                        value={minScoreFilter}
                        onChange={(e) => setMinScoreFilter(e.target.value)}
                        style={styles.filterInput}
                    />
                    <input
                        type="number"
                        placeholder="Max score"
                        value={maxScoreFilter}
                        onChange={(e) => setMaxScoreFilter(e.target.value)}
                        style={styles.filterInput}
                    />
                </div>
            )}

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.td}>Username</th>
                        <th style={styles.td}>Total Score</th>
                        <th style={styles.td}>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRankings.map((ranking, index) => (
                        <tr 
                            key={index}
                            draggable={isAdmin}
                            onDragStart={isAdmin ? (e) => handleDragStart(e, index) : null}
                            onDrop={isAdmin ? (e) => handleDrop(e, index) : null}
                            onDragOver={isAdmin ? handleDragOver : null}
                        >
                            <td style={styles.td}>{ranking["user__username"]}</td>
                            <td style={styles.td}>{ranking.total_score}</td>
                            <td style={styles.td}>
                                <button 
                                    onClick={() => handleViewMore(ranking.user__id)} 
                                    style={styles.viewButton}
                                >
                                    View More
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Download button  */}
            
                <button 
                    onClick={handlePublishResults} 
                    style={styles.publishButton}
                >
                    Download Results
                </button>
            

            {showResults && selectedUserResults.length > 0 && (
                <div style={styles.resultsContainer}>
                    <h2>Results for Selected User</h2>
                    <button onClick={handleCloseResults} style={styles.closeButton}>Close Results</button>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.td}>Subject Title</th>
                                <th style={styles.td}>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedUserResults.map((result, index) => (
                                <tr key={index}>
                                    <td style={styles.td}>{result.subject__title}</td>
                                    <td style={styles.td}>{result.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Ranking;