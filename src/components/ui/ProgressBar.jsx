import React from 'react'

function ProgressBar({ completed, total }) {
    const percentage = total === 0 ? 0 : (completed / total) * 100;

    return (
        <div style={styles.wrapper}>
            <div style={styles.header}>
                <span style={styles.title}>Daily Progress</span>
                <span style={styles.count}>
                    {completed} of {total} done
                </span>
            </div>

            <div style={styles.barContainer}>
                <div
                    style={{
                        ...styles.barFill,
                        width: `${percentage}%`,
                    }}
                />
            </div>
        </div>
    )
}

export default ProgressBar