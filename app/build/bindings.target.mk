# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := bindings
DEFS_Debug := \
	'-DNODE_GYP_MODULE_NAME=bindings' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-DV8_DEPRECATION_WARNINGS' \
	'-DV8_IMMINENT_DEPRECATION_WARNINGS' \
	'-D_GLIBCXX_USE_CXX11_ABI=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DV8_COMPRESS_POINTERS' \
	'-DV8_COMPRESS_POINTERS_IN_ISOLATE_CAGE' \
	'-DV8_31BIT_SMIS_ON_64BIT_ARCH' \
	'-DV8_REVERSE_JSARGS' \
	'-D__STDC_FORMAT_MACROS' \
	'-DOPENSSL_NO_PINSHARED' \
	'-DOPENSSL_THREADS' \
	'-DOPENSSL_NO_ASM' \
	'-DBUILDING_NODE_EXTENSION' \
	'-DDEBUG' \
	'-D_DEBUG' \
	'-DV8_ENABLE_CHECKS'

# Flags passed to all source files.
CFLAGS_Debug := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	-g \
	-O0

# Flags passed to only C files.
CFLAGS_C_Debug :=

# Flags passed to only C++ files.
CFLAGS_CC_Debug := \
	-fno-rtti \
	-std=gnu++14

INCS_Debug := \
	-I/home/ivo/.electron-gyp/19.1.3/include/node \
	-I/home/ivo/.electron-gyp/19.1.3/src \
	-I/home/ivo/.electron-gyp/19.1.3/deps/openssl/config \
	-I/home/ivo/.electron-gyp/19.1.3/deps/openssl/openssl/include \
	-I/home/ivo/.electron-gyp/19.1.3/deps/uv/include \
	-I/home/ivo/.electron-gyp/19.1.3/deps/zlib \
	-I/home/ivo/.electron-gyp/19.1.3/deps/v8/include

DEFS_Release := \
	'-DNODE_GYP_MODULE_NAME=bindings' \
	'-DUSING_UV_SHARED=1' \
	'-DUSING_V8_SHARED=1' \
	'-DV8_DEPRECATION_WARNINGS=1' \
	'-DV8_DEPRECATION_WARNINGS' \
	'-DV8_IMMINENT_DEPRECATION_WARNINGS' \
	'-D_GLIBCXX_USE_CXX11_ABI=1' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DV8_COMPRESS_POINTERS' \
	'-DV8_COMPRESS_POINTERS_IN_ISOLATE_CAGE' \
	'-DV8_31BIT_SMIS_ON_64BIT_ARCH' \
	'-DV8_REVERSE_JSARGS' \
	'-D__STDC_FORMAT_MACROS' \
	'-DOPENSSL_NO_PINSHARED' \
	'-DOPENSSL_THREADS' \
	'-DOPENSSL_NO_ASM' \
	'-DBUILDING_NODE_EXTENSION'

# Flags passed to all source files.
CFLAGS_Release := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	-O3 \
	-fno-omit-frame-pointer

# Flags passed to only C files.
CFLAGS_C_Release :=

# Flags passed to only C++ files.
CFLAGS_CC_Release := \
	-fno-rtti \
	-std=gnu++14

INCS_Release := \
	-I/home/ivo/.electron-gyp/19.1.3/include/node \
	-I/home/ivo/.electron-gyp/19.1.3/src \
	-I/home/ivo/.electron-gyp/19.1.3/deps/openssl/config \
	-I/home/ivo/.electron-gyp/19.1.3/deps/openssl/openssl/include \
	-I/home/ivo/.electron-gyp/19.1.3/deps/uv/include \
	-I/home/ivo/.electron-gyp/19.1.3/deps/zlib \
	-I/home/ivo/.electron-gyp/19.1.3/deps/v8/include

OBJS :=

# Add to the list of files we specially track dependencies for.
all_deps += $(OBJS)


### Rules for final target.
LDFLAGS_Debug := \
	-pthread \
	-rdynamic \
	-m64

LDFLAGS_Release := \
	-pthread \
	-rdynamic \
	-m64

LIBS :=

$(obj).target/bindings.node: GYP_LDFLAGS := $(LDFLAGS_$(BUILDTYPE))
$(obj).target/bindings.node: LIBS := $(LIBS)
$(obj).target/bindings.node: TOOLSET := $(TOOLSET)
$(obj).target/bindings.node:  FORCE_DO_CMD
	$(call do_cmd,solink_module)

all_deps += $(obj).target/bindings.node
# Add target alias
.PHONY: bindings
bindings: $(builddir)/bindings.node

# Copy this to the executable output path.
$(builddir)/bindings.node: TOOLSET := $(TOOLSET)
$(builddir)/bindings.node: $(obj).target/bindings.node FORCE_DO_CMD
	$(call do_cmd,copy)

all_deps += $(builddir)/bindings.node
# Short alias for building this executable.
.PHONY: bindings.node
bindings.node: $(obj).target/bindings.node $(builddir)/bindings.node

# Add executable to "all" target.
.PHONY: all
all: $(builddir)/bindings.node

