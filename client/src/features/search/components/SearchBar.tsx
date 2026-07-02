import { SearchIcon } from "../../../assets/icons/SearchIcon";
import styles from "./SearchBar.module.css";

type ISearchBarProps = {
    searchText: string;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

export function SearchBar({ 
    searchText, 
    setSearchText 
}: ISearchBarProps) {

    return (
        <label className={styles.searchBarContainer}>

            <div className={styles.searchIconContainer}>
                <SearchIcon />
            </div>

            <input
                type="text"
                placeholder="Search users..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={styles.searchInput}
            />

        </label>
    );
}