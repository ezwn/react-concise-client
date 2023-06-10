# react-concise-client

**Version**: 2.0.0-2023-05-29

A convenient REST client integrated with React.

## Configuration

```tsx
const App = () => <ApiClientProvider configMap={{
    "auth": {
        baseURL: "http://localhost:8100/",
    },
    "store": {
        baseURL: "http://localhost:8080/",
    }
}}>
...
</ApiClientProvider>;
```

## Usage

```typescript
const apiClient = useApiClient("store");

const response = await apiClient.post('/saveItem', {
    ...
});

```