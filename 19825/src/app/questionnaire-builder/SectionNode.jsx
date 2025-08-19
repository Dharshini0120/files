import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const SectionNode = ({ data, id }) => {
  const { sectionName, weight, onUpdate, onDelete } = data;
  const [isEditing, setIsEditing] = useState(!sectionName);
  const [localSectionName, setLocalSectionName] = useState(sectionName || '');
  const [localWeight, setLocalWeight] = useState(weight || 1);

  const handleSave = () => {
    if (!localSectionName.trim()) {
      alert('Please enter a section name');
      return;
    }
    if (localWeight < 1) {
      alert('Weight must be at least 1');
      return;
    }
    onUpdate(id, { 
      sectionName: localSectionName,
      weight: localWeight 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!sectionName) {
      onDelete(id);
    } else {
      setLocalSectionName(sectionName);
      setLocalWeight(weight || 1);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div style={{
        minWidth: '400px',
        maxWidth: '450px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          background: '#4baaf4',
          color: 'white',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Add Section
          </h3>
          <button
            onClick={handleCancel}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '0',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Section Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Section Name:
            </label>
            <input
              type="text"
              value={localSectionName}
              onChange={(e) => setLocalSectionName(e.target.value)}
              placeholder="Enter section name here..."
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4baaf4'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Weight */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Weight (Importance):
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={localWeight}
              onChange={(e) => setLocalWeight(parseInt(e.target.value) || 1)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4baaf4'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              Higher weight = more important for overall progress
            </div>
          </div>

          {/* Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={handleSave}
              style={{
                background: '#4baaf4',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2196c9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#4baaf4'}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              style={{
                background: '#fd5475',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              Cancel
            </button>
          </div>
        </div>

        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  }

  return (
    <div style={{
      minWidth: '300px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: '3px solid #4f46e5',
      borderRadius: '12px',
      color: 'white',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.2)',
        padding: '12px 15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '9px 9px 0 0'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          SECTION
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            style={{
              background: '#fd5475',
              border: 'none',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: '700',
          textAlign: 'center'
        }}>
          {localSectionName || 'Untitled Section'}
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          opacity: 0.9,
          marginBottom: '8px'
        }}>
          <span>Weight: {localWeight || 1}</span>
          <span> Connect questions</span>
        </div>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default SectionNode;

