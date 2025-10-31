import React from 'react';

/**
 * Example component demonstrating the new CSS system
 * This shows how to combine custom component classes with Tailwind utilities
 */
export const StyleShowcase: React.FC = () => {
  return (
    <div className="container-custom py-4xl">
      <div className="mb-2xl">
        <h1 className="text-4xl font-bold text-primary mb-lg">CSS System Showcase</h1>
        <p className="text-neutral-400">
          Examples of the new unified CSS system combining custom components with Tailwind utilities.
        </p>
      </div>

      {/* Button Examples */}
      <section className="mb-3xl">
        <h2 className="text-2xl font-bold text-primary mb-lg">Buttons</h2>
        <div className="flex flex-wrap gap-md">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-ghost">Ghost Button</button>
          <button className="btn btn-primary btn-sm">Small Primary</button>
          <button className="btn btn-secondary btn-lg">Large Secondary</button>
        </div>
      </section>

      {/* Form Examples */}
      <section className="mb-3xl">
        <h2 className="text-2xl font-bold text-primary mb-lg">Form Controls</h2>
        <div className="max-w-md space-y-lg">
          <input 
            type="text" 
            className="form-input" 
            placeholder="Text input example"
          />
          <textarea 
            className="form-input form-textarea" 
            placeholder="Textarea example"
            rows={3}
          />
          <select className="form-input form-select">
            <option>Select option 1</option>
            <option>Select option 2</option>
            <option>Select option 3</option>
          </select>
        </div>
      </section>

      {/* Card Examples */}
      <section className="mb-3xl">
        <h2 className="text-2xl font-bold text-primary mb-lg">Cards</h2>
        <div className="grid-responsive max-w-4xl">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Basic Card</h3>
              <p className="card-description">This is a basic card using the component class system.</p>
            </div>
            <div className="flex gap-sm mt-lg">
              <button className="btn btn-primary btn-sm">Action</button>
              <button className="btn btn-ghost btn-sm">Cancel</button>
            </div>
          </div>
          
          <div className="card hover:border-primary/50 transition-colors">
            <div className="card-header">
              <h3 className="card-title">Enhanced Card</h3>
              <p className="card-description">This card combines component classes with Tailwind utilities.</p>
            </div>
            <div className="bg-neutral-900/50 p-lg rounded-md mt-lg">
              <p className="text-sm text-neutral-400">Code example area</p>
            </div>
          </div>
        </div>
      </section>

      {/* Badge Examples */}
      <section className="mb-3xl">
        <h2 className="text-2xl font-bold text-primary mb-lg">Badges</h2>
        <div className="flex flex-wrap gap-md">
          <span className="badge badge-primary">Primary Badge</span>
          <span className="badge badge-secondary">Secondary Badge</span>
          <span className="badge badge-outline">Outline Badge</span>
        </div>
      </section>

      {/* Loading States */}
      <section className="mb-3xl">
        <h2 className="text-2xl font-bold text-primary mb-lg">Loading States</h2>
        <div className="flex items-center gap-xl">
          <div className="flex items-center gap-sm">
            <div className="loading-spinner"></div>
            <span className="text-sm text-neutral-400">Loading spinner</span>
          </div>
          <div className="flex items-center gap-sm">
            <div className="loading-dots"></div>
            <span className="text-sm text-neutral-400">Loading dots</span>
          </div>
        </div>
      </section>

      {/* Text Utilities */}
      <section className="mb-3xl">
        <h2 className="text-2xl font-bold text-primary mb-lg">Text Utilities</h2>
        <div className="space-y-md max-w-lg">
          <div>
            <h4 className="text-lg font-semibold text-primary mb-sm">Single Line Truncation</h4>
            <p className="truncate-1 text-neutral-400 bg-neutral-900/50 p-sm rounded">
              This is a very long text that will be truncated to a single line when it exceeds the container width.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-primary mb-sm">Two Line Truncation</h4>
            <p className="truncate-2 text-neutral-400 bg-neutral-900/50 p-sm rounded">
              This is a longer text that will be truncated to exactly two lines when it exceeds the container width. This allows for more content while maintaining consistent layout.
            </p>
          </div>
        </div>
      </section>

      {/* Animation Examples */}
      <section className="mb-3xl">
        <h2 className="text-2xl font-bold text-primary mb-lg">Animations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg max-w-2xl">
          <div className="card animate-fade-in text-center">
            <p className="text-sm text-neutral-400">Fade In</p>
          </div>
          <div className="card animate-slide-up text-center">
            <p className="text-sm text-neutral-400">Slide Up</p>
          </div>
          <div className="card animate-scale-in text-center">
            <p className="text-sm text-neutral-400">Scale In</p>
          </div>
        </div>
      </section>

      {/* Backdrop Blur Examples */}
      <section className="mb-3xl">
        <h2 className="text-2xl font-bold text-primary mb-lg">Backdrop Blur</h2>
        <div className="relative bg-gradient-to-r from-neutral-800 to-neutral-600 rounded-lg p-xl">
          <div className="absolute inset-4 bg-black/30 backdrop-blur-sm rounded border border-neutral-700 flex items-center justify-center">
            <span className="text-sm text-neutral-300">Backdrop Blur Small</span>
          </div>
        </div>
      </section>

      {/* CSS Variables Usage */}
      <section className="mb-3xl">
        <h2 className="text-2xl font-bold text-primary mb-lg">CSS Variables in Action</h2>
        <div className="bg-neutral-900/50 p-lg rounded-lg">
          <p className="text-sm text-neutral-400 mb-md">
            This section uses CSS variables directly:
          </p>
          <div 
            className="p-lg rounded-md text-center"
            style={{
              backgroundColor: 'var(--color-neutral-800)',
              color: 'var(--color-primary)',
              fontSize: 'var(--font-size-lg)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            Styled with CSS Variables
          </div>
        </div>
      </section>

      <div className="text-center text-neutral-500 text-sm">
        <p>This showcase demonstrates the unified CSS system combining custom components with Tailwind utilities.</p>
      </div>
    </div>
  );
};