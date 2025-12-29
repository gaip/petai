# PetTwin Care - Improvement Plan

## Objective

Create the best possible implementation of the tech stack to win the Hackathon. Focus on code quality, robustness, aesthetic appeal, and realistic simulation of the proposed architecture.

## 1. Quality Assurance & Testing

- [x] **Backend Tests**: Implemented basic API tests using `pytest` and `httpx`.
  - **Status**: Passing (5 tests verified basic mocked endpoints).
- [ ] **Frontend Tests**: Add basic rendering tests for the landing page and dashboard components.
- [ ] **CI Pipeline**: Create a GitHub Action to automatically run backend tests on push.

## 2. Backend Architecture Refactoring

**Goal**: Move from a script-based prototype to a production-grade FastAPI application structure.

- [ ] **Modularize**: Split `main.py` into:
  - `app/api/endpoints.py` (Routes)
  - `app/models.py` (Pydantic schemas)
  - `app/services.py` (Business logic & Simulation)
  - `app/core/config.py` (Settings)
- [ ] **Validation**: Replace manual query parameters with Pydantic models for `POST` requests.
- [ ] **Type Safety**: Ensure strict type hinting throughout the codebase.

## 3. Frontend & Aesthetics (The "Wow" Factor)

- [ ] **Code Cleanup**: Refactor `AIAssistant.tsx` to move inline styles to CSS Modules or Tailwind (if adopted), ensuring cleaner code.
- [ ] **Visual Polish**:
  - Enhance the "AI Assistant" chat interface with smoother typing animations.
  - Ensure the "Dark Mode" theme is consistent across all components.
  - Add "Skeleton Loading" states for data fetching to simulate a polished app experience.
- [ ] **Dashboard**: Ensure charts (if any) are responsive and interactive.

## 4. Simulation Fidelity

- [ ] **Enrich Data Simulator**: Update `data_simulator.py` to generate more varied anomaly types (e.g., "Sudden Activity Drop", "High Nighttime Heart Rate").
- [ ] **Mock Latency**: Fine-tune the artificial delays in the API to realistically mimic Vertex AI processing times (not too slow, but noticeable "thinking").

## 5. Documentation

- [ ] **API Docs**: Ensure FastAPI's Swagger UI (`/docs`) is well-documented with descriptions for each endpoint (judges might check this).
- [ ] **Architecture**: Keep the `ArchitectureDiagram` component updated if logic changes.

## Next Steps

1.  **Refactor Backend**: Execute the modularization of `main.py`.
2.  **Polish Frontend**: Clean up styles in `AIAssistant`.
3.  **Setup CI**: Add `.github/workflows/test.yml`.
