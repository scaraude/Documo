import { ReactNode } from "react";

interface IDInputProps {
    id: string;
    setId: (id: string) => void;
}

export const IDInput = ({ id, setId }: IDInputProps): ReactNode => (
    <div>
        <label htmlFor="id" className="block text-sm font-medium text-gray-700">
            ID
        </label>
        <input
            id="id"
            name="id"
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Entrez l'ID"
            autoFocus
        />
    </div>
)