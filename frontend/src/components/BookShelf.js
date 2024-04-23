import { useEffect } from 'react';
import { useCall, useContractFunction } from '@usedapp/core';
import { utils } from 'ethers';
import { Button, Card, Typography } from '@mui/material';
import { margin } from '@mui/system';
import BookDetails from './BookDetails';

const styles = {
    box: { minHeight: '100vh', backgroundColor: '#1b3864' },
    vh100: { minHeight: '100vh' },
    card: { borderRadius: 4, padding: 4, maxWidth: '800px', width: '100%', margin: 'auto'},
    alignCenter: { textAlign: 'center' },
};

function BookShelf({ contract }) {
    const books = useCall({ contract, method: 'getAvailableBooks', args: [] });
    const { state, send } = useContractFunction(contract, 'borrowBook');
    const { state: stateReturn, send: sendReturn } = useContractFunction(contract, 'returnBook');

    useEffect(() => {
        if (books && books.value) {
            console.log(books.value);
        }
    }, [books]);

    console.log(books);

    const handleBorrowBook = async (bookId) => {
        try {
            await send(bookId);
            // Book borrowed successfully
        } catch (error) {
            console.error('Error borrowing book:', error);
            // Handle error
        }
    };
    
    const handleReturnBook = async (bookId) => {
        try {
            await sendReturn(bookId);
            // Book returned successfully
        } catch (error) {
            console.error('Error returning book:', error);
            // Handle error
        }
    }

    return(
        <>
            {books && books.value && (
                <Card sx={{ ...styles.card, marginBottom: '8px' }}>
                    <h1 style={styles.alignCenter}>Available Books</h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                    {books.value[0].map((book, index) => (
                        <Card key={index} sx={{ width: '200px', padding: '16px', textAlign: 'center' }}>
                            <Typography>Id: {book.id.toNumber()} </Typography>
                            <BookDetails contract={contract} bookId={book.id.toNumber()} />
                            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '8px' }}>
                                <Button onClick={() => handleBorrowBook(book.id.toNumber())}>Borrow</Button>
                                <Button onClick={() => handleReturnBook(book.id.toNumber())}>Return</Button>
                            </div>
                        </Card>
                    ))}
                    </div>
                </Card>
            )}
        </>
    );

}

export default BookShelf;